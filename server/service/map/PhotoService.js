const mybatisMapper = require('mybatis-mapper');
const logger = require('../../helper/LogHelper');
const DBPool = require('../../helper/DBPool');
const { RuntimeExeption } = require('../../helper/ExceptionHelper');

class PhotoService {
    constructor() {
        mybatisMapper.createMapper([
            './server/mapper/map/PhotoMapper.xml',
        ]);
    }

    async getPhotos(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('PhotoMapper', 'selectPostsPhotos', params);
            let [result] = await dbcon.query(sql);
            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    async addPhotos(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = null;

            for (const k of params.files) {
                sql = mybatisMapper.getStatement('PhotoMapper', 'insertPlacePhoto', {
                    userId: params.userId,
                    placeId: params.placeId,
                    file: k
                });
                const [{ affectedRows }] = await dbcon.query(sql);

                if (affectedRows === 0) {
                    throw new RuntimeExeption('사진 추가 도중 오류가 발생했습니다.');
                }
            }

            sql = mybatisMapper.getStatement('PhotoMapper', 'selectPostsPhotos', params);
            [data] = await dbcon.query(sql);
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }
}

module.exports = new PhotoService();