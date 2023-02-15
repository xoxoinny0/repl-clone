const mybatisMapper = require('mybatis-mapper');
const DBPool = require('../../helper/DBPool');
const { RuntimeException } = require('../../helper/ExceptionHelper');
const logger = require('../../helper/LogHelper');

class LoginService {
    /** 생성자를 통해 Mapper 로드 */
    constructor() {
        // Mapper는 프로젝트 루트 기준 상대경로로
        mybatisMapper.createMapper([
            './server/mapper/login/LoginMapper.xml'
        ]);
    }

    /** 새로운 유저 회원가입 처리 */
    async addUser(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('LoginMapper', 'insertUser', params);
            let [{ insertId, affectedRows }] = await dbcon.query(sql);

            if (affectedRows.length === 0) {
                throw new RuntimeException('회원가입 처리에 실패했습니다.');
            }

            sql = mybatisMapper.getStatement('LoginMapper', 'selectItem', { id: insertId });
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('회원가입 처리에 실패했습니다.');
            }

            data = 200;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 기존의 데이터가 있는지 중복 여부 검사 */
    async checkValue(params) {
        if (!params.fieldName || !params.value) {
            throw new RuntimeException('검색할 데이터가 없습니다.');
        }

        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('LoginMapper', 'searchUser', params);
            let [result] = await dbcon.query(sql);

            if (result[0].cnt === 0) data = 0;
            else data = 1;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }

    /** 로그인 처리 */
    async makeLogin(params) {
        const { userId, userPw } = params;
        if (!userId || !userPw) {
            throw new RuntimeException('로그인 정보가 잘못되었습니다.');
        }

        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('LoginMapper', 'findId', {
                userid: userId
            });
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('아이디가 존재하지 않습니다.');
            }

            const currentId = result[0].id;
            const currentPw = result[0].password;
            
            if (userPw !== currentPw) {
                throw new RuntimeException('비밀번호가 틀렸습니다.');
            }

            sql = mybatisMapper.getStatement('LoginMapper', 'selectItem', {
                id: currentId
            });
            [result] = await dbcon.query(sql);

            [data] = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) dbcon.release();
        }

        return data;
    }
}

module.exports = new LoginService();