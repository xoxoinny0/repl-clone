const dayjs = require('dayjs');
const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const postService = require('../../service/bulletin/PostService');

module.exports = (() => {
    const url = process.env.BULLETIN_PATH;
    const router = express.Router();

    /** 단일 게시글 데이터 조회 */
    router.get(`${url}/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '게시글 번호가 없습니다.');
            regexHelper.num(id, '게시글 번호가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 조회 */
        let json = null;
        let follower = [];

        try {
            json = await postService.getItem({ id: id });
        } catch (err) {
            return next(err);
        }

        try {
            let data = await postService.getFollower({ id: json.userId });
            data.map(v => follower.push(v.from));
        } catch (err) {
            return next(err);
        }

        json.follower = follower;
 
        res.sendResult({ item: json });
    });

    /** 팔로우 처리 */
    router.post(`${url}/follow`, async (req, res, next) => {
        const { follow_from, follow_to } = req.body;
        let result = null;

        try {
            regexHelper.value(follow_from, '팔로워 정보가 없습니다.');
            regexHelper.num(follow_from, '팔로워 정보가 잘못되었습니다.');
            regexHelper.value(follow_to, '대상 정보가 없습니다.');
            regexHelper.num(follow_to, '대상 정보가 잘못되었습니다.');

            result = postService.addFollow({
                follow_from: follow_from,
                follow_to: follow_to
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    router.post(`${url}/unfollow`, async (req, res, next) => {
        const { follow_from, follow_to } = req.body;
        let result = null;

        try {
            regexHelper.value(follow_from, '팔로워 정보가 없습니다.');
            regexHelper.num(follow_from, '팔로워 정보가 잘못되었습니다.');
            regexHelper.value(follow_to, '대상 정보가 없습니다.');
            regexHelper.num(follow_to, '대상 정보가 잘못되었습니다.');

            result = postService.deleteFollow({
                follow_from: follow_from,
                follow_to: follow_to
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: result });
    });

    /** 게시글에서 추천된 장소 목록 */
    router.get(`${url}/places/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '게시글 번호가 없습니다.');
            regexHelper.num(id, '게시글 번호가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 조회 */
        let json = null;

        try {
            json = await postService.getPlaces({ id: id });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 게시글에 붙은 카테고리 태그 목록 */
    router.get(`${url}/getTags/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '게시글 번호가 없습니다.');
            regexHelper.num(id, '게시글 번호가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 조회 */
        let json = null;

        try {
            json = await postService.getTags({ id: id });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 단일 게시글의 댓글 데이터 조회 */
    router.get(`${url}/comments/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '게시글 번호가 없습니다.');
            regexHelper.num(id, '게시글 번호가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 조회 */
        let json = null;

        try {
            json = await postService.getComments({ id: id });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 게시글에 댓글 달기 기능 */
    router.post(`${url}/comments/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;
        const { user_id, content } = req.body;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '게시글 번호가 없습니다.');
            regexHelper.num(id, '게시글 번호가 잘못되었습니다.');

            regexHelper.value(user_id, '유저 정보가 없습니다.');
            regexHelper.num(user_id, '유저 정보가 잘못되었습니다.');

            regexHelper.value(content, '댓글 내용이 없습니다.');
        } catch (err) {
            return next(err);
        }

        let result = null;

        try {
            result = await postService.postComment({
                user_id: user_id,
                bulletin_id: id,
                content: content,
                commentdate: dayjs().format('YYYY-MM-DD')
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult(result);
    });

    /** 게시자가 작성한 다른 글 목록 */
    router.get(`${url}/otherPosts/:id`, async (req, res, next) => {
        // 파라미터 받기
        const { id } = req.params;

        // 파라미터 유효성 검사
        try {
            regexHelper.value(id, '유저 정보가 없습니다.');
            regexHelper.num(id, '유저 정보가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 조회 */
        let json = null;

        try {
            json = await postService.getOtherPosts({ id: id });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    return router;
})();