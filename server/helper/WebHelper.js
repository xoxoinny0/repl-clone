const logger = require('./LogHelper');

const WebHelper = () => {
    return (req, res, next) => {
        /** Express의 req, res의 기능을 확장 */
        // req.foo = () => { ... };
        // res.bar = () => { ... };

        /** 프론트엔드에게 JSON 결과를 출력하는 기능 */
        res._sendResult = (data, error = null) => {
            /**
             * {
             *     rt: 결과 (OK, 혹은 에러 이름),
             *     rtcode: HTTP 상태코드 (200, 400, 404, 500),
             *     rtmsg: 결과 메세지 (OK 없음. 에러인 경우 에러 내용),
             *     ... JSON 데이터 ...
             *     pubdate: 생성일시
             * }
             */
            const json = {
                rt: 'OK',
                rtcode: 200,
                rtmsg: null
            };

            if (error) {
                json.rt = error.rt || 'Server Error';
                json.rtcode = error.code || 500;
                json.rtmsg = error.message || '요청을 처리하는데 실패했습니다.';

                if (isNaN(json.rtcode)) {
                    json.rtcode = 500;
                }
            }

            if (data) {
                for (const item in data) {
                    json[item] = data[item];
                }
            }

            // 표준시로부터 한국의 시차를 적용하여 ISO 포맷을 생성
            const offset = new Date().getTimezoneOffset() * 60000;
            const today = new Date(Date.now() - offset);
            json.pubdate = today.toISOString();

            res.header('Content-Type', 'application/json; charset=utf-8');
            res.header('name', encodeURIComponent(json.name));
            res.header('message', encodeURIComponent(json.message));
            res.status(json.rtcode || 200).send(json);
        };

        /** 결과가 200(OK)인 경우에 대한 JSON 출력 */
        res.sendResult = data => {
            res._sendResult(data);
        };

        /** 에러처리 출력 */
        res.sendError = error => {
            logger.error(error.stack);
            res._sendResult(null, error);
        };

        // Express의 다음 처리 단계로 제어 이전
        next();
    };
};

module.exports = WebHelper;