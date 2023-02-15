const express = require('express');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const { pagenation } = require('../../helper/UtilHelper');
const bulletinService = require('../../service/bulletin/BulletinService');
const PostService = require('../../service/bulletin/PostService');

module.exports = (() => {
    const url = process.env.BULLETIN_PATH;
    const router = express.Router();

    /** 전체 게시글 목록 조회 */
    router.get(url, async (req, res, next) => {
        // 파라미터들 저장
        const { query, tag, page=1, rows=8, sortByLike, id, isMyPost, userId } = req.query;

        if (id) {
            let json = null;

            try {
                json = await PostService.getItem({
                    id: id
                })
            } catch (err) {
                return next(err);
            }

            res.sendResult({ item: json });
            return;
        }

        const params = {};
        params.sortByLike = sortByLike;

        // 검색 파라미터를 MyBatis 전송용 객체로 변환
        if (query) {
            params.query = query;
        }
        // 태그 저장
        if (tag) params.tagId = parseInt(tag);
        // 내 게시물일 경우
        if (isMyPost === 'true') params.isMyPost = true;
        if (userId) params.userId = userId;

        /** 데이터 조회 */
        let data = null;
        let pageInfo = null;

        try {
            // 전체 데이터 수 얻기
            const totalCount = await bulletinService.getCount(params);
            pageInfo = pagenation(totalCount, page, rows);
            
            params.offset = pageInfo.offset;
            params.listCount = pageInfo.listCount;

            data = await bulletinService.getList(params);
        } catch (err) {
            return next(err);
        }

        res.sendResult({ pagenation: pageInfo, item: data });
    });

    /** 내가 후기 남긴 장소 목록 불러오기 */
    router.get(`${url}/myplace/:id`, async (req, res, next) => {
        const { id } = req.params;

        let json = null;

        try {
            json = await bulletinService.getMyPlaces({ id: id });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 게시글 작성 처리 */
    router.post(`${url}/newPost`, async (req, res, next) => {
        const { user_id, title, postdate, bgcolor, bgimage, content, selectedPlaces, selectedTags } = req.body;

        // 유효성 검사
        try {
            regexHelper.value(user_id, '작성자 정보가 없습니다.');
            regexHelper.num(user_id, '작성자 정보가 잘못되었습니다.');
            regexHelper.value(title, '게시글 제목이 없습니다.');
            regexHelper.value(postdate, '게시일이 없습니다.');
            regexHelper.value(bgcolor, '글 배경색이 지정되지 않았습니다');
            regexHelper.value(content, '글 의 내용이 없습니다');
        } catch (err) {
            return next(err);
        }

        let json = null;

        try {
            json = await bulletinService.addPost({
                user_id: user_id,
                title: title,
                postdate: postdate,
                bgcolor: bgcolor,
                bgimage: bgimage,
                content: content,
                selectedPlaces: selectedPlaces,
                selectedTags: selectedTags
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 카테고리 선택창 태그들 불러오기 */
    router.get(`/categories`, async (req, res, next) => {
        let data = null;

        try {
            data = await bulletinService.getCategories();
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: data });
    });

    return router;
})();