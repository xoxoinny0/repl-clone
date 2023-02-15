const mybatisMapper = require('mybatis-mapper');
const logger = require('../../helper/LogHelper');
const DBPool = require('../../helper/DBPool');
const dayjs = require('dayjs');
const { RuntimeException } = require('../../helper/ExceptionHelper');

class ThemeService {
    /** 생성자를 통해 Mapper 로드 */
    constructor() {
        // Mapper는 프로젝트 루트 기준 상대경로로
        mybatisMapper.createMapper([
            './server/mapper/main/ThemeMapper.xml',
        ]);
    }

    async getList(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('ThemeMapper', 'selectList', params);
            data = await dbcon.query(sql);

            if (data.length === 0) {
                return [];
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data[0];
    }

    async getPlaces(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('ThemeMapper', 'selectThemePlaces', params);
            [data] = await dbcon.query(sql);

            if (data.length === 0) {
                return [];
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    async addPlaceTheme(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('ThemeMapper', 'insertPlaceTheme', params);
            let [{ insertId, affectedRows }] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('장소의 테마 추가에 실패했습니다.');
            }

            sql = mybatisMapper.getStatement('ThemeMapper', 'selectThemePlaceItem', {
                id: insertId
            });
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('추가한 테마 데이터 불러오기에 실패했습니다.');
            }

            [data] = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }
}
    
module.exports = new ThemeService();