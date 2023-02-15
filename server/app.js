/*-------------------------------------------------------
    1) 모듈 참조
--------------------------------------------------------*/
/** 직접 구현한 모듈 */
const logger = require('./helper/LogHelper');
const { myip, urlFormat, sendMail } = require('./helper/UtilHelper');
const fileHelper = require('./helper/FileHelper');
const WebHelper = require('./helper/WebHelper');
const regexHelper = require('./helper/RegexHelper');
/** 내장 모듈 */
const url = require('url');
const fs =  require('fs');
const { join, resolve } = require('path');
/** 설치 필요 모듈*/
const dotenv = require('dotenv');                   // 설정파일 활용
const express = require('express');                 // Express 본체
const useragent = require('express-useragent');     // 클라이언트 정보 조회
const serveStatic = require('serve-static');        // 특정 폴더 파일을 URL로 노출
const serveFavicon = require('serve-favicon');      // favicon 처리
const bodyParser = require('body-parser');          // POST 파라미터 처리
const methodOverride = require('method-override');  // PUT, DELETE 파라미터 처리
const cookieParser = require('cookie-parser');      // Cookie 처리
const expressSession = require('express-session');  // Session 처리
const nodemailer = require('nodemailer');           // 메일발송 (app.use 필요없음)
const cors = require('cors');                       // CORS 접근 허용
const MySQLStore = require('express-mysql-session')(expressSession);
/** 예외처리 관련 클래스 */
const { BadRequestException, PageNotFoundException } = require('./helper/ExceptionHelper');

/*--------------------------------------------------------
    2) Express 객체 생성
---------------------------------------------------------*/
// express로 생성한 객체의 use() 메소드를 이용해서
// 각종 외부 기능, 설정 내용, URL을 계속해서 확장해 나갈 수 있음
const app = express();

// 설정 파일 내용 가져오기
const configFileName = process.env.NODE_ENV !== 'production' ? '.env.server.development' : '.env.server.production';
const configPath = join(resolve(), configFileName);

// 설정 파일이 없을 때 에러 처리
if (!fs.existsSync(configPath)) {
    try {
        throw new Error();
    } catch (e) {
        logger.error('┌───────────────────────────────────────────┐');
        logger.error('│          Configuration Init Error         │');
        logger.error('└───────────────────────────────────────────┘');
        logger.error('환경설정 파일을 찾을 수 없습니다. 환경설정 파일의 경로를 확인하세요.');
        logger.error(`환경설정 파일 경로 : ${configPath}`);
        logger.error('프로그램을 종료합니다.');
        process.exit(1);
    }
}

// 설정 파일 로드
dotenv.config({ path: configPath });

/*--------------------------------------------------------
    3) 클라이언트 접속시 초기화
---------------------------------------------------------*/
/** Express 객체 app에 UserAgent 모듈 탑재 */
// --> Express에 추가되는 확장 기능들을 Express에선 미들웨어라고 부름
// --> UserAgent 모듈은 초기화 콜백함수에 전달되는 req, res 객체를 확장하기 때문에 다른 모듈보다 제일 먼저 설정되어야 함
app.use(useragent.express());

// 클라이언트 접속 감지
app.use((req, res, next) => {
    logger.verbose('─────────────── 클라이언트 접속 ──────────────');
    
    // 접속 시간
    const beginTime = Date.now();

    // 클라이언트가 요청한 페이지 URL
    // 콜백 함수의 req 파라미터는 클라이언트가 요청한 URL 각 부분을 변수로 담고 있음
    const current_url = urlFormat({
        protocol: req.protocol,     // ex)  http://
        host: req.get('host'),      //      172.16.141.1
        port: req.port,             //      3000
        pathname: req.originalUrl   //      /page1.html
    });

    logger.debug(`[${req.method}] ${decodeURIComponent(current_url)}`);

    // 클라이언트 IP 주소
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    // 클라이언트의 디바이스 정보 기록 (userAgent 사용)
    logger.debug(`[client] ${ip} / ${req.useragent.os} / ${req.useragent.browser} (${req.useragent.version} / ${req.useragent.platform})`);

    // 접속 종료 이벤트 -> 모든 응답 전송이 완료됨
    res.on('finish', () => {
        // 종료 시간
        const endTime = Date.now();

        // 클라이언트가 머문 시간 = 백엔드 구동 시간 ( 1초 미만으로 유지하기 )
        const time = endTime - beginTime;
        logger.debug(`클라이언트 접속 종료 ::: [runtime] ${time}ms`);
        logger.verbose('─────────────────────────────────────────────\n');
    });

    // 본 콜백 함수를 종료하고 요청 URL에 연결된 기능으로 제어 이전
    next();
});

/*--------------------------------------------------------
    4) Express 객체의 추가 설정
---------------------------------------------------------*/
/** POST 파라미터의 수신 모듈 설정. 추가되는 미들웨어 중 가장 먼저 설정해야 함 */
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
// extended: true --> 지속적 사용
// extended: false --> 한번만 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // Text 형식 파라미터 수신 가능
app.use(bodyParser.json()); // Json 형식 파라미터 수신 가능

/** HTTP PUT, DELETE 전송방식 확장 */
// 브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP Header 이름
app.use(methodOverride('X-HTTP-Method'));           // Microsoft
app.use(methodOverride('X-HTTP-Method-Override'));  // Google/GData
app.use(methodOverride('X-Method-Override'));       // IBM

/** 쿠키를 처리할 수 있는 객체 연결 */
// cookie-parser는 데이터를 저장, 조회할 때 암호화 처리를 동반
// 이 때 암호화에 사용하는 key 문자열을 개발자가 정해야 함
app.use(cookieParser(process.env.COOKIE_ENCRYPT_KEY));

/** HTML, CSS, JS, IMG 등 정적 파일을 URL에 노출시킬 폴더 연결 */
// "http://아이피(혹은 도메인):포트번호" 이후 경로가 router에 등록되지 않은 경로라면
// static 모듈에 연결된 폴더 안에서 해당 경로를 탕색
app.use('/', serveStatic(process.env.PUBLIC_PATH));

// 업로드 된 파일이 저장될 경로를 URL에 노출
app.use(process.env.UPLOAD_URL, serveStatic(process.env.UPLOAD_DIR));

// 썸네일 이미지가 저장될 폴더를 URL에 노출함
app.use(process.env.THUMB_URL, serveStatic(process.env.THUMB_DIR));

/** favicon 설정 */
app.use(serveFavicon(process.env.FAVICON_PATH));

/** CORS 접근 허용 */
app.use(cors());

/** WebHelper 설정 */
app.use(WebHelper());

/** 세션 설정 */
app.use(expressSession({
    // 암호화 키
    secret: process.env.SESSION_ENCRYPT_KEY,
    // 세션이 초기화 되지 않더라도 새로 저장할지 여부(통상 false)
    resave: false,
    // 세션이 저장되기 전 기존 세션을 초기화 상태로 만들지 여부
    saveUninitialized: false,
    store: new MySQLStore({
        host: process.env.DATABASE_HOST,            // MYSQL 서버 주소 (다른 PC 경우 IP 주소)
        port: process.env.DATABASE_PORT,            // MYSQL 포트 번호
        user: process.env.DATABASE_USERNAME,        // MYSQL 로그인 가능한 계정 이름
        password: process.env.DATABASE_PASSWORD,    // 비밀번호
        database: process.env.DATABASE_SCHEMA,      // 사용하고자 하는 데이터베이스 이름
        createDatabaseTable: process.env.MYSQL_SESSION_CREATE_TABLE,
        schema: {
            tableName: process.env.MYSQL_SESSION_TABLE_NAME,
            columnNames: {
                session_id: process.env.MYSQL_SESSION_FIELD_ID,
                expires: process.env.MYSQL_SESSION_FIELD_EXPIRES,
                data: process.env.MYSQL_SESSION_FIELD_DATA,
            },
        },
    }),
}));

/** 라우터(URL 분배기) 객체 설정 -> 맨 마지막에 설정해야 함 */
const router = express.Router();
// 라우터를 express에 등록
app.use('/', router);

/*--------------------------------------------------------
    5) 각 URL별 백엔드 기능 정의
---------------------------------------------------------*/
app.use(require('./controller/main/ThemeController'));
app.use(require('./controller/map/MapController'));
app.use(require('./controller/map/PhotoController'));

app.use(require('./controller/login/LoginController'));

app.use(require('./controller/bulletin/BulletinController'));
app.use(require('./controller/bulletin/PostController'));

app.use(require('./controller/FileController'));
app.use(require('./controller/SessionController'));

/** 에러 처리 -> 반드시 모든 route 처리의 마지막에 위치해야 함 */
// 컨트롤러에서 에러 발생시 `next(에러객체)`를 호출, 해당 동작을 여기서 처리
app.use((err, req, res, next) => res.sendError(err));

// 앞에서 정의하지 않은 기타 URL에 대한 일괄 처리 -> 무조건 맨 마지막에 정의
app.use('*', (req, res, next) => res.sendError(new PageNotFoundException()));

/*--------------------------------------------------------
    6) 설정한 내용 기반으로 서버 구동 시작
---------------------------------------------------------*/
const ip = myip();

app.listen(process.env.PORT, () => {
    logger.info('┌───────────────────────────────────────────┐');
    logger.info('│            Start Express Server           │');
    logger.info('└───────────────────────────────────────────┘');

    ip.forEach((v, i) => {
        logger.debug(`server address => http://${v}:${process.env.PORT}`);
    });

    logger.info('─────────────────────────────────────────────\n');
});

/** 프로그램(서버) 종료 이벤트 */
process.on('exit', () => {
    logger.info('┌───────────────────────────────────────────┐');
    logger.info('│             Quit Express Server           │');
    logger.info('└───────────────────────────────────────────┘');
});

/** Ctrl + C 눌러서 프로그램 강제종료 시 이벤트 */
process.on('SIGINT', () => {
    // 정상적으로 프로그램을 종료하도록 위에서 정의한 close 이벤트 호출
    process.exit();
});