const express = require('express');
const logger = require('../helper/LogHelper');

module.exports = (() => {
    const url = '/session';
    const router = express.Router();

    router
        .post(url, (req, res, next) => {
            // POST로 전송된 변수값 추출
            const userId = req.body.userId;
            const username = req.body.username;

            // 세션 저장
            req.session.user_id = userId;
            req.session.username = username;

            // 결과 응답
            const json = { rt: 'ok' };
            res.status(200).send(json);
        })
        .get(url, (req, res, next) => {
            // 저장되어 있는 모든 session 값 탐색
            for (let key in req.session) {
                const str = `[session] ${key} = ${req.session[key]}`;
                logger.debug(str);
            }

            // 세션 데이터를 JSON으로 구성 후 클라이언트에게 응답으로 전송
            const my_data = {
                user_id: req.session.userId,
                username: req.session.username
            };

            res.status(200).send(my_data);
        })
        .delete(url, async (req, res, next) => {
            let result = 'ok';
            let code = 200;

            try {
                await req.session.destroy();
            } catch (err) {
                logger.error(err.message);
                result = err.message;
                code = 500;
            }

            const json = { rt: result };
            res.status(code).send(json);
        });

    return router;
})();