const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const LoginService = require('../../service/login/LoginService');

module.exports = (() => {
    const url = process.env.LOGIN_PATH;
    const router = express.Router();

    router.post(`${url}/signUp`, async (req, res, next) => {
        // 프론트엔드 form에서 넘겨준 데이터들 구조분해해 저장
        const { name, userId, username, email, password } = req.body;

        // 받아온 데이터 유효성 검사
        try {
            regexHelper.value(name, '이름이 없습니다.');
            regexHelper.value(userId, '아이디가 없습니다.');
            regexHelper.value(username, '닉네임이 없습니다.');
            regexHelper.value(email, '이메일이 없습니다.');
            regexHelper.value(password, '비밀번호가 없습니다.');

            regexHelper.engNum(userId, '아이디는 영문과 숫자로만 입력하십시오.');
            regexHelper.email(email, '이메일 형식이 올바르지 않습니다.');
        } catch (err) {
            return next(err);
        }

        let json = null;

        try {
            json = await LoginService.addUser({
                name: name,
                userid: userId,
                username: username,
                email: email,
                password: password,
                icon: '🐶',
                introduction: '',
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 데이터 있는지 중복 여부 검사 */
    router.get(`${url}/check/:fieldName/:value`, async (req, res, next) => {
        const { fieldName, value } = req.params;
        let result = {
            fieldName: fieldName,
            data: 0
        };

        try {
            result.data = await LoginService.checkValue({
                fieldName: fieldName,
                value: value,
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    /** 로그인 처리 */
    router.post(`${url}/signIn`, async (req, res, next) => {
        const { userId, userPw } = req.body;
        console.log(userId, userPw);

        let json = null;

        try {
            json = await LoginService.makeLogin({
                userId: userId,
                userPw: userPw
            });
        } catch (err) {
            return next(err);
        }

        req.session.userInfo = json[0];

        res.sendResult({ item: json });
    });

    return router;
})();