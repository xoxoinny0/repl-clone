const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const PhotoService = require('../../service/map/PhotoService');

module.exports = (() => {
    const router = express.Router();

    router.get(`/placePhoto/:placeId`, async (req, res, next) => {
        let result = null;

        const { placeId } = req.params;

        try {
            result = await PhotoService.getPhotos({ placeId: placeId });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.post('/placePhoto', async (req, res, next) => {
        let result = null;
        const { userId, placeId, files } = req.body;

        try {
            result = await PhotoService.addPhotos({
                userId: userId,
                placeId: placeId,
                files: files
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    return router;
})();