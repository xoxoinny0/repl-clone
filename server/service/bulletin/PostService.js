const mybatisMapper = require('mybatis-mapper');
const dayjs = require('dayjs');
const DBPool = require('../../helper/DBPool');
const { RuntimeException } = require('../../helper/ExceptionHelper');
const logger = require('../../helper/LogHelper');
const { nextPowerTwo } = require('add');

class PostService {
    /** 생성자를 통해 Mapper 로드 */
    constructor() {
        // Mapper는 프로젝트 루트 기준 상대경로로
        mybatisMapper.createMapper([
            './server/mapper/bulletin/PostMapper.xml'
        ]);
    }

    /** 게시글 데이터 조회 */
    async getItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectItem', params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('조회 결과 없음');
            }

            [data] = result;

            data.postdate = dayjs(data.postdate).format('YYYY-MM-DD')
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시글에서 추천된 장소 목록 조회 */
    async getPlaces(params) {
        let dbcon = null;
        let data = null;
        let temp = null;
        let result = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectPlaces', params);
            [result] = await dbcon.query(sql);

            if (result.length === 0) {
                return [];
            }

            for (let i = 0; i < result.length; i++) {
                sql = mybatisMapper.getStatement('PostMapper', 'selectPlaceInfo', {id: result[i].id});
                [[temp]] = await dbcon.query(sql);

                if (temp.rating) result[i].rating = Math.round(temp.rating);
                else result[i].rating = '-';
                if (temp.comment) result[i].comment = temp.comment;
                else result[i].comment = 0;

                sql = mybatisMapper.getStatement('PostMapper', 'selectPlacePhoto', {id: result[i].id});
                [temp] = await dbcon.query(sql);
                if (temp.length > 0) result[i].img = temp[0].place_image;
                else result[i].img = null;
            };

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시글에 선정된 카테고리들 조회 */
    async getTags(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'getTags', params);
            let [result] = await dbcon.query(sql);

            data = result;
        } catch (err) {
            throw err
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시자의 팔로워 정보 조회 */
    async getFollower(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectFollower', params);
            [data] = await dbcon.query(sql);

        } catch (err) {
            throw err
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시자 팔로우 여부 검색 */
    async getIsFollowed(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectIsFollowed', params);
            let [result] = await dbcon.query(sql);

            if (result.length > 0) {
                data = 1;
            } else {
                data = 0;
            }
        } catch (err) {
            throw err
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시자 팔로우 처리 */
    async addFollow(params) {
        let dbcon = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'insertFollow', params);
            let [{ affectedRows }] = await dbcon.query(sql);

            if (affectedRows.length === 0) {
                throw new RuntimeException('팔로우 처리에 실패했습니다.');
            }
            
        } catch (err) {
            throw err
        } finally {
            if (dbcon) dbcon.release();
        }

        return 1;
    }

    /** 게시자 언팔로우 처리 */
    async deleteFollow(params) {

        console.log(params);
        let dbcon = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'deleteFollow', params);
            let [{ affectedRows }] = await dbcon.query(sql);

            if (affectedRows.length === 0) {
                throw new RuntimeException('언팔로우 처리에 실패했습니다.');
            }
            
        } catch (err) {
            throw err
        } finally {
            if (dbcon) dbcon.release();
        }

        return 1;
    }

    /** 게시글의 댓글 데이터 조회 */
    async getComments(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectComments', params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                return [];
            }

            data = result;

            data.forEach(v => {
                v.commentdate = dayjs(v.commentdate).format('YYYY-MM-DD');
            })
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 게시글에 댓글 달기 */
    async postComment(params) {
        let dbcon = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'postComment', params);
            let [{ affectedRows }] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('데이터 저장 실패');
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return 200;
    }

    /** 게시자의 다른 게시글 조회 */
    async getOtherPosts(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('PostMapper', 'selectOtherPosts', params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                return [];
            }

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }
}

module.exports = new PostService();