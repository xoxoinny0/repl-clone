const fs = require('fs');
const dotenv = require('dotenv');
const { join, resolve } = require('path');

class FileHelper {
    static #current = null;

    static getInstance() {
        if (FileHelper.#current == null) FileHelper.#current = new FileHelper();

        return FileHelper.#current;
    }

    mkdirs(target, permission = '0755', data = '') {
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

    mkDataFile (data = '') {
        const configFileName = process.env.NODE_ENV !== 'production' ? '.env.server.development' : '.env.server.production';
        const configPath = join(resolve(), configFileName);

        if (!fs.existsSync(configPath)) {
            try {
                throw new Error();
            } catch (e) {
                console.error('┌────────────────────────────────────────┐');
                console.error('│        Configuration Init Error        │');
                console.error('└────────────────────────────────────────┘');
                console.error('환경설정 파일을 찾을 수 없습니다. 환경설정 파일의 경로를 확인하세요.');
                console.error(`환경설정 파일 경로 : ${configPath}`);
                console.error('프로그램을 종료합니다.');
                process.exit(1);
            }
        }

        dotenv.config({ path: configPath });

        const targetPath = process.env.EDITOR_TEST;
        const targetFile = 'testData.html';

        this.mkdirs(targetPath);

        fs.writeFileSync(`${targetPath}/${targetFile}`, data, err => {
            if (err) {
                console.error(err);
                return;
            } else {
                console.log(`${targetFile} 파일 저장 완료. 경로 : ${targetPath}`);
                console.log(`내용 : ${fs.readFileSync(`${targetPath}/${targetFile}`, 'utf8')}`);
            }
        });
    }
}

module.exports = FileHelper.getInstance();