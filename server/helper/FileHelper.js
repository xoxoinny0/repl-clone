const fs = require('fs');
const { join, extname } = require('path');
const multer = require('multer');               // 업로드 모듈
const thumbnail = require('node-thumbnail');    // 썸네일 이미지 생성 모듈

class FileHelper {
    static #current = null;

    static getInstance() {
        if (FileHelper.#current == null) FileHelper.#current = new FileHelper();

        return FileHelper.#current;
    }

    mkdirs(target, permission = '0755') {
        // 대상 경로가 없다면 탈출
        if (target == undefined || target == null) { return; }
    
        // 윈도우는 경로가 역슬래쉬로 옴(문자열 내부이므로 두개)
        // 이거 리눅스처럼 그냥 슬래쉬로 변경(윈도우는 둘다가능)
        target = target.replace(/\\/gi, '/');
        // Node.js v.17 이상 -> replaceAll('\\', '/');
    
        let dir = ''; // 폴더 깊이 누적할 변수
    
        // 경로를 / 단위로 자름
        const target_list = target.split('/');
    
        // 리눅스/맥 등에선 절대경로가 /로 시작되는 경우가 있음
        // 이 때 target_list의 0번 아이템이 빈칸이 되므로 잘라냄
        // 맨 첫글자가 / 이면 dir 시작을 /으로
        if (target.substring(0, 1) == '/') {
            dir = '/';
        }
    
        // 윈도우는 하드디스크 문자에 : 붙어있음
        // 그 때 디스크 기준 디렉토리 경로 설정 위해 뒤에 / 붙여줌
        if (target_list[0].indexOf(':') > -1) {
            target_list[0] += '/'
        }
    
        // 잘라낸 배열만큼 순환하며 디렉토리 생성
        target_list.forEach((v, i) => {
            dir = join(dir, v);
    
            // 현 폴더를 의미한다면 이번 턴은 중단
            if (v == '.') {
                return;
            }
    
            // console.debug(dir);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                fs.chmodSync(dir, permission);
            }
        });
    }

    /**
     * 업로드 객체를 초기화하여 리턴
     * @returns multer 객체
     */
    initMulter() {
        // 업로드 될 폴더 생성
        this.mkdirs(process.env.UPLOAD_DIR);

        /** multer 객체 생성 --> 파일 제한: 5개, 20M */
        const multipart = multer({
            /* 저장될 디렉토리 경로 및 파일 이름 */
            storage: multer.diskStorage({
                /** 업로드 된 파일이 저장될 디렉토리 설정 */
                // req는 요청정보, file은 최종적으로 업로드된 결과 데이터가 저장되어 있을 객체
                destination: (req, file, callback) => {
                    /**
                     * file 파라미터의 형식은 다음과 같다
                     * 
                     * file = {
                     *     fieldname: 'myphoto',
                     *     originalname: '원본파일명.jpg',
                     *     encoding: '7bit',
                     *     mimetype: 'image/jpeg'
                     * }
                     */
                    console.group('destination');
                    console.debug(file);
                    console.groupEnd();

                    // 업로드 정보에 백엔드의 업로드 파일 저장 폴더 위치를 추가한다
                    // 윈도우 환경을 고려하여 역슬래시를 슬래시로 변경하는 처리 추가
                    file.upload_dir = process.env.UPLOAD_DIR.replace(/\\/gi, '/');

                    // multer 객체에게 업로드 경로를 전달
                    callback(null, file.upload_dir);
                },
                /** 업로드 된 파일이 저장될 파일 이름을 결정함 */
                filename: (req, file, callback) => {
                    /**
                     * file 파라미터는 앞 과정을 통해 정보가 확장된 상태
                     * 
                     * file = {
                     *     fieldname: 'myphoto',
                     *     originalname: '원본파일명.jpg',
                     *     encoding: '7bit',
                     *     mimetype: 'image/jpeg',
                     *     upload_dir: '업로드 된 파일이 저장될 경로'
                     * }
                     */
                    console.group('filename');
                    console.debug(file);
                    console.groupEnd();

                    // 파일의 원본 이름에서 확장자만 추출 --> ex) .png
                    const extName = extname(file.originalname).toLowerCase();
                    // 파일이 저장될 이름 (현재_시각의_timestamp + 확장자)
                    const saveName = new Date().getTime().toString() + extName;

                    // 업로드 정보에 백엔드에 업로드 되어 저장된 파일 이름을 추가
                    file.savename = saveName;
                    // 업로드 된 파일이 저장된 최종 경로 추가
                    file.path = join(file.upload_dir, saveName);
                    // 업로드 정보에 파일에 접근할 수 있는 URL값 추가
                    file.url = join(process.env.UPLOAD_URL, saveName).replace(/\\/gi, '/');
                    // 구성된 최종 업로드 정보를 클라이언트에게 응답결과로 돌려주기 위해 req 객체에게 추가
                    // 멀티 업로드로 req.file 객체가 배열이라면 배열의 원소로 추가한다
                    if (req.file instanceof Array) req.file.push(file);
                    else req.file = file;

                    // 다음 단계로 백엔드상에 저장할 파일 이름을 전달
                    callback(null, saveName);
                },
            }),
            /* 용량, 최대 업로드 파일 수 제한 설정 */
            limits: {
                files: parseInt(process.env.UPLOAD_MAX_COUNT),
                fileSize: parseInt(eval(process.env.UPLOAD_MAX_SIZE)),
            },
            /* 업로드 될 파일의 확장자 제한 */
            fileFileter: (req, file, callback) => {
                // 파일의 확장자를 소문자로 얻기 --> '.png' --> 'png'
                const extName = extname(file.originalname).substring(1).toLocaleLowerCase();

                // 확장자 제한이 있을 경우 필터링
                if (process.env.UPLOAD_FILE_FILTER !== undefined) {
                    // 'png|jpg|gif'.indexof('png')를 찾지 못했다면 --> png|jpg|gif
                    if (process.env.UPLOAD_FILE_FILTER.indexOf(extName) == -1) {
                        const err = new Error();
                        err.code = 500;
                        err.message = process.env.UPLOAD_FILE_FILTER.replaceAll('|', ', ') + ' 형식만 업로드 가능합니다.';
                        return callback(err);
                    }
                }

                callback(null, true);
            },
        });

        // 생성된 객체를 리턴한다.
        return multipart;
    }

    /**
     * 에러가 존재한다면 에러 코드와 메세지를 설정하여 throw 시킨다.
     * @param {multer.MulterError} err
     */
    checkUploadError(err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                switch (err.code) {
                    case 'LIMIT_FILE_COUNT':
                        err.code = 500;
                        err.message = '업로드 가능한 파일 수를 초과했습니다.';
                        break;
                    case 'LIMIT_FILE_SIZE':
                        err.code = 500;
                        err.message = '업로드 가능한 파일 용량을 초과했습니다.';
                        break;
                    default:
                        err.code = 500;
                        err.message = '알 수 없는 에러가 발생했습니다.';
                        break;
                }
            }

            throw err;
        }
    }

    /**
     * 썸네일 이미지를 생성하고 썸네일의 위치를 파라미터로 전달받은 JSON에 추가한다
     * @param {Object} file 파일 업로드 결과를 저장하고 있는 JSON 객체
     */
    async createThumbnail(file) {
        // 업로드 될 폴더 생성
        this.mkdirs(process.env.THUMB_DIR);

        // 환경설정 파일에서 썸네일 이미지 크기를 가져온 후 정수 배열로 변환
        const size = process.env.THUMB_SIZE.split('|').map((v, i) => parseInt(v));

        for (let i = 0; i < size.length; i++) {
            const v = size[i];

            // 생성된 썸네일 파일의 옵션과 파일 이름 생성
            const thumb_options = {
                source: file.path,                  // 썸네일 생성할 원본 경로
                destination: process.env.THUMB_DIR, // 썸네일이 생성될 경로
                width: v,                           // 썸네일 크기 (기본값 800)
                prefix: 'thumb_',
                suffix: '_' + v + 'w',
                override: true
            };

            // 생성될 썸네일 파일의 이름을 예상
            const basename = file.savename;
            const filename = basename.substring(0, basename.lastIndexOf('.'));
            const thumbname = thumb_options.prefix + filename + thumb_options.suffix + extname(basename);

            console.group('thumbnail');
            console.debug(basename, filename, thumbname);
            console.groupEnd();

            // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
            if (!file.hasOwnProperty('thumbnail')) {
                file.thumbnail = {};
            }

            // 썸네일 정보를 width를 key로 갖는 json 형태로 추가하기 위해 key 이름 생성
            const key = v + 'w';
            file.thumbnail[key] = `${process.env.THUMB_URL}/${thumbname}`;

            await thumbnail.thumb(thumb_options);
        }
    }

    /**
     * 배열로 전달되는 업로드 파일 정보를 반복처리하여 썸네일 생성함
     */
    async createThumbnailMultiple(files) {
        for (let i = 0; i < files.length; i++) {
            await this.createThumbnail(files[i]);
        }
    }
}

module.exports = FileHelper.getInstance();