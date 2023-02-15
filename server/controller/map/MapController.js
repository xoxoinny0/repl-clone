const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const MapService = require('../../service/map/MapService');

module.exports = (() => {
    const url = process.env.MAP_PATH;
    const router = express.Router();

    router.get(`${url}`, async (req, res, next) => {
        let result = null;

        try {
            result = await MapService.getList();
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.post('/bookmark', async (req, res, next) => {
        let result = null;
        const { user_id, place_id } = req.body;

        try {
            result = await MapService.addBookmark({
                userId: user_id,
                placeId: place_id
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.get('/bookmark', async (req, res, next) => {
        const query = req.query;
        let result = null;

        try {
            if (query.place_id) {
                result = await MapService.getUserBookmarkItem({
                    userId: query.user_id,
                    placeId: query.place_id
                });
            } else {
                result = await MapService.getUserBookmarkList({
                    userId: query.user_id,
                });
            }
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.delete('/bookmark/:index', async (req, res, next) => {
        let result = null;
        let { index } = req.params;

        try {
            result = await MapService.deleteBookmark({
                id: index
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.get('/placeReview', async (req, res, next) => {
        let result = null;
        let { place_id } = req.query;

        try {
            result = await MapService.getReviews({
                placeId: +place_id
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.get('/placePost', async (req, res, next) => {
        let result = null;
        let { place_id } = req.query;

        try {
            result = await MapService.getPosts({
                placeId: +place_id
            });
        } catch (err) {
            return next(err);
        }
        
        res.sendResult({ item: result });
    });

    router.post('/placeReview', async (req, res, next) => {
        let result = null;
        let { user_id, place_id, rating, content } = req.body;

        try {
            result = await MapService.addComment({
                userId: +user_id,
                placeId: +place_id,
                rating: +rating,
                content: content
            });
        } catch (err) {
            return next(err);
        }
        
        res.sendResult({ item: result });
    });

    router.post('/map', async (req, res, next) => {
        let result = null;

        try {
            result = await MapService.addPlace({
                id: req.body.id,
                place_name: req.body.place_name,
                address_name: req.body.address_name,
                road_address_name: req.body.road_address_name,
                lat: req.body.lat,
                lng: req.body.lng,
                category_item_name: req.body.category_item_name,
                phone: req.body.phone,
                place_url: req.body.place_url
            });
        } catch (err) {
            return next(err);
        }

        console.log(result);
        
        res.sendResult({ item: result });
    });

    return router;
})();