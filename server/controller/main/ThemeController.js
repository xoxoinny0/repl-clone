const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const ThemeService = require('../../service/main/ThemeService');

module.exports = (() => {
    const url = process.env.MAIN_THEME_PATH;
    const router = express.Router();

    router.get(`${url}`, async (req, res, next) => {
        let result = null;
        try {
            result = await ThemeService.getList();
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.get(`/theme_place`, async (req, res, next) => {
        let result = null;
        try {
            result = await ThemeService.getPlaces();
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.post('/theme_place', async (req, res, next) => {
        let result = null;
        const { place_id, theme_id, user_id } = req.body;

        try {
            result = await ThemeService.addPlaceTheme({
                placeId: place_id,
                themeId: theme_id,
                userId: user_id
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    return router;
})();