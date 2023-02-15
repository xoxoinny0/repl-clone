const express = require('express');
const logger = require('../helper/LogHelper');
const fileHelper = require('../helper/FileHelper');

module.exports = (() => {
    const router = express.Router();

    router.post('/upload/single', (req, res, next) => {
        // name 속성이 customPhoto인 경우에 대한 업로드를 수행 --> multer 객체가 생성되고 설정 내용이 실행됨
        // <input type='file' name='customPhoto' />
        const upload = fileHelper.initMulter().single('customPhoto');

        upload(req, res, async (err) => {
            console.group('request');
            console.debug(req.file);
            console.groupEnd();
    
            // 에러 여부 확인, 결과 코드 및 메세지 생성
            try {
                fileHelper.checkUploadError(err);
            } catch (err) {
                console.group('err');
                console.debug(err);
                console.groupEnd();
                res.status(500).send({
                    rt: err.code,
                    rtMsg: err.message
                });
            }
    
            // 썸네일 생성
            try {
                await fileHelper.createThumbnail(req.file);
            } catch (err) {
                console.group('err');
                console.debug(err);
                console.groupEnd();
                res.status(500).send({
                    rt: err.code,
                    rtmsg: err.message
                });
                return;
            }
    
            // 준비한 결과값 변수를 활용하여 클라이언트에게 응답 전송
            res.status(200).send(req.file);
        });
    });
    
    router.post('/upload/multiple', (req, res, next) => {
        // 업로드 결과가 저장될 파일 객체를 배열로 초기화
        req.file = [];
    
        // name 속성이 myphoto인 경우에 대한 업로드를 수행
        // --> 설정 파일에서 UPLOAD_MAX_COUNT에 저장한 만큼 업로드 가능
        // --> UPLOAD_MAX_COUNT 값을 -1로 지정 시 수량 제한 없음
        const upload = fileHelper.initMulter().array('customPhoto');
    
        upload(req, res, async err => {
            console.group('request');
            console.debug(req.file);
            console.groupEnd();
    
            // 에러 여부 확인, 결과 코드 및 메세지 생성
            try {
                fileHelper.checkUploadError(err);
            } catch (err) {
                console.group('err');
                console.debug(err);
                console.groupEnd();
                res.status(500).send({
                    rt: err.code,
                    rtMsg: err.message
                });
                return;
            }
    
            // 썸네일 생성
            try {
                await fileHelper.createThumbnailMultiple(req.file);
            } catch (err) {
                console.error(err);
                res.status(500).send({
                    rt: err.code,
                    rtmsg: err.message
                });
                return;
            }
    
            // 준비한 결과값 변수를 활용해 클라이언트에게 응답을 보냄
            res.status(200).send(req.file);
        });
    });

    return router;
})();