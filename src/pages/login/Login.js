import React, { memo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import PageButton from '../../components/mypage/PageButton';
import { NavLink, useNavigate } from 'react-router-dom';
import RegexHelper from '../../helper/RegexHelper';
import { useSelector, useDispatch } from 'react-redux';
import { makeLogin } from '../../slices/login/LoginSlice';
import cookieHelper from '../../helper/CookieHelper';
import { getLoginState } from '../../slices/login/LoginStateSlice';

const EmailLoginCon = styled.div`
    display: flex;
    flex-direction: column;
    /* background-color: pink; */
    align-items: center;
    
    h2 {
        text-align: center;
        margin-top: 100px;
        margin-bottom: 70px;
        font-weight: bold;
        font-size: 18px;
    }

    .loginCon {
        display: flex;
        flex-direction: column;
        width: 300px;
        /* background-color: skyblue; */
        
        label {
            margin-right: 10px;
        }
        
        input {
          box-shadow: 1px 2px 5px #DADADA;
          width: 100%;
          height: 50px;
          border: none;
          outline: none;
          border-radius: 12px;
          padding-left: 20px;
          box-sizing: border-box;
          color: #0581bb;
          margin-bottom: 25px;
          margin-top: 10px;
        }

        .loginButton {
            width: 100%;
            margin-top: 20px;
        }

        .link {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
        }
    }
`

const Login = memo(() => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.LoginSlice);

    const onLoginSubmit = useCallback(e => {
        e.preventDefault();

        const target = e.currentTarget;

        console.log(target.emailId.value, target.emailPwd.value);
        const params = {
            userId: target.emailId.value,
            userPw: target.emailPwd.value
        }

        dispatch(makeLogin(params)).then(({ payload, error }) => {
            if (error) {
                window.alert(payload.data.rtmsg);
                return;
            }

            cookieHelper.setCookie('loginInfo', JSON.stringify(payload.item), {
                'max-age': 60 * 60 * 24,
            });

            console.log("payload.item",payload.item);
            
            //로그인 상태 true로 변경
            dispatch(getLoginState(true));
            
            window.history.back();
        });
    }, []);
    
    return (
        <EmailLoginCon>
            <h2>리플 로그인하기</h2>
            <div className='loginCon'>
                <form onSubmit={onLoginSubmit}>
                    <label htmlFor='emailId'>아이디</label>
                    <input type="text" name='emailId' id='emailId' placeholder='아이디를 입력하세요' required />
                    <label htmlFor='emailPwd'>비밀번호</label>
                    <input type="password" name='emailPwd' id='emailPwd' placeholder='비밀번호를 입력하세요' required />
                    <PageButton type='submit' className='loginButton' width='180px' height='50px' color='#0584BB'>로그인</PageButton>
                </form>
                <div className='link'>
                    <NavLink>아이디/비밀번호 찾기</NavLink>
                    <NavLink to='/join'>회원가입</NavLink>
                </div>
            </div>
        </EmailLoginCon>
    );
});

export default Login;