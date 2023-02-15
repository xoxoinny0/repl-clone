import React, { memo, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import PageButton from '../../components/mypage/PageButton';
import { NavLink, useNavigate } from 'react-router-dom';
import regex from '../../helper/RegexHelper';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../../slices/login/LoginSlice';

const JoinCon = styled.div`
    display: flex;
    flex-direction: column;
    /* background-color: pink; */
    align-items: center;
    
    h2 {
        text-align: center;
        margin-top: 70px;
        margin-bottom: 60px;
        font-weight: bold;
        font-size: 18px;
    }

    .joinCon {
        display: flex;
        flex-direction: column;
        width: 300px;
        /* background-color: skyblue; */
        
        label {
            margin-right: 10px;
            font-size: 14px;
        }
        
        input {
          box-shadow: 1px 2px 5px #DADADA;
          width: 100%;
          height: 40px;
          border: none;
          outline: none;
          border-radius: 12px;
          padding-left: 20px;
          box-sizing: border-box;
          color: #0581bb;
          margin-bottom: 25px;
          margin-top: 10px;
        }

        /* #userId {
            width: 80%;
        } */

        .joinButton {
            width: 100%;
            margin-top: 20px;
            margin-bottom: 60px;
        }

        .link {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
        }

        .nameBox {
            display: flex;
            /* background-color: yellow; */

            .checkId {
                margin-left: 10px;
                margin-top: 10px;
            }
        }
    }
`

const Join = memo(() => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.LoginSlice);

    // 중복확인 됐는지, 확인 후 값 바뀌었는지 여부 확인용 state
    const [isIdChanged, setIsIdChanged] = useState(false);
    const [isUsernameChanged, setIsUsernameChanged] = useState(false);

    /** 중복확인 눌렀을 시 처리 */
    const onIdCheckClick = useCallback(e => {
        e.preventDefault();

        const field = document.querySelector('#joinForm').userId;

        try {
            regex.minLength(field, 5, '아이디는 5~15자로 입력해주세요.');
            regex.maxLength(field, 15, '아이디는 5~15자로 입력해주세요.');
            regex.engNum(field, '아이디는 영문과 숫자로만 이루어져 있어야 합니다.');
        } catch (err) {
            window.alert(err.message);
            return;
        }

        axios.get(`${process.env.REACT_APP_LOGIN_URL}/check/userid/${field.value}`)
            .then(({ data }) => {
                if (data.rtcode !== 200) {
                    window.alert(`서버 에러! Error Code [${data.rtcode}]`);
                    return;
                }

                if (data.item.data !== 0) {
                    window.alert('이미 존재하는 아이디입니다.');
                } else {
                    const confirmed = window.confirm('사용 가능합니다. 이 아이디를 사용하시겠습니까?');
                    if (confirmed) setIsIdChanged(false);
                }
            })
            .catch(() => {
                window.alert(`서버 에러! Error Code [500]`);
            });
    }, []);
    const onUsernameCheckClick = useCallback(e => {
        e.preventDefault();

        const field = document.querySelector('#joinForm').eName;

        try {
            regex.minLength(field, 5, '닉네임은 2~8자로 입력해주세요.');
            regex.maxLength(field, 15, '닉네임은 2~8자로 입력해주세요.');
        } catch (err) {
            window.alert(err.message);
            return;
        }

        axios.get(`${process.env.REACT_APP_LOGIN_URL}/check/username/${field.value}`)
            .then(({ data }) => {
                if (data.rtcode !== 200) {
                    console.error(`서버 에러! Error Code [${data.rtcode}]`);
                    return;
                }

                if (data.item.data !== 0) {
                    window.alert('이미 존재하는 닉네임입니다.');
                } else {
                    const confirmed = window.confirm('사용 가능합니다. 이 닉네임을 사용하시겠습니까?');
                    if (confirmed) setIsUsernameChanged(false);
                }
            })
            .catch(() => {
                console.error(`서버 에러! Error Code [500]`);
            });
    }, []);

    // 아이디 / 닉네임 값 변경시 중복확인 다시하도록
    const onIdValueChange = useCallback(e => {
        e.preventDefault();
        setIsIdChanged(true);
    }, []);
    const onUsernameValueChange = useCallback(e => {
        e.preventDefault();
        setIsUsernameChanged(true);
    }, []);

    const onAddUserSubmit = useCallback(e => {
        e.preventDefault();

        if (isIdChanged) {
            window.alert('아이디 검사를 수행하세요.');
            return;
        }
        if (isUsernameChanged) {
            window.alert('닉네임 검사를 수행하세요.');
            return;
        }

        const target = e.currentTarget;
        const email = target.email;
        const password = target.userPw;
        const passwordCheck = target.userPw2;

        try {
            regex.email(email, '이메일 형식이 올바르지 않습니다.');
            regex.compareTo(password, passwordCheck, '비밀번호가 동일하지 않습니다.');
        } catch (err) {
            window.alert(err.message);
            return;
        }

        const params = {
            name: target.name.value,
            userId: target.userId.value,
            username: target.eName.value,
            email: email.value,
            password: password.value
        }

        dispatch(addUser(params)).then(({ payload }) => {
            console.log(payload);
            if (payload === null) return;
            if (payload?.item !== 200) {
                window.alert('서버 오류! 회원가입에 실패했습니다.');
                return;
            }
    
            window.alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
            navigate('/login/repl');
        });
    }, [isIdChanged, isUsernameChanged]);

    return (
        <JoinCon>
            <h2>회원가입</h2>
            <div className='joinCon'>
                <form id='joinForm' onSubmit={onAddUserSubmit}>
                    <label htmlFor='name'>이름</label>
                    <input type="text" name='name' id='name' placeholder='이름을 입력하세요' required />

                    <label htmlFor='userId'>아이디</label>
                    <div className='nameBox'>
                        <input type="text" name='userId' id='userId' placeholder='아이디를 입력하세요' onChange={onIdValueChange} required />
                        <PageButton className='checkId' width='90px' height='40px' color='#0584BB' onClick={onIdCheckClick} >중복확인</PageButton>
                    </div>

                    <label htmlFor='eName'>닉네임(변경가능)</label>
                    <div className='nameBox'>
                        <input type="text" name='eName' id='eName' placeholder='닉네임을 입력하세요' onChange={onUsernameValueChange} required />
                        <PageButton className='checkId' width='90px' height='40px' color='#0584BB' onClick={onUsernameCheckClick} >중복확인</PageButton>
                    </div>

                    <label htmlFor='email'>이메일</label>
                    <input type="text" name='email' id='email' placeholder='이메일을 입력하세요' required />

                    <label htmlFor='userPw'>비밀번호</label>
                    <input type="text" name='userPw' id='userPw' placeholder='비밀번호를 입력하세요' required />

                    <label htmlFor='userPw2'>비밀번호 확인</label>
                    <input type="text" name='userPw2' id='userPw2' placeholder='비밀번호를 입력하세요' required />

                    <PageButton type='submit' className='joinButton' width='180px' height='50px' color='#0584BB'>가입하기</PageButton>
                </form>
            </div>
        </JoinCon>
    );
});

export default Join;