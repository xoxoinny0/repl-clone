import React, { memo, useEffect } from 'react';
import PageInputBox from '../../components/mypage/PageInputBox';
import styled from 'styled-components';
import PageContainer from '../../components/mypage/PageContainer';

import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../slices/InfoSlice';

const NotiCon = styled(PageContainer)`

    .contents {
        margin: 60px auto;
        /* background-color: pink; */
        /* width: 70%; */
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
            margin-right: 30px;
            font-size: 20px;
            /* background-color: pink; */
            line-height: 60px;
            color: #424242;

        }
        
        .notiMapCnt {
            font-size: 14px;
        }

        .closePopUp {
            color: #424242;
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            font-size: 20px;
        
        &:hover {
            cursor: pointer;
            background-color: #ccc;
        }
    }
    }

`

const Noti = memo(() => {

    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.InfoSlice);

    useEffect(()=> {
        dispatch(getInfo());
    }, [dispatch])

    const idData = data?.find((v, i) => v.id === 2)

    return (
        <NotiCon>
            <h2>마이페이지 &gt; 신고목록</h2>
            <div className='contents'>
                {idData?.noti.map((v, i) => {
                    return (
                        <PageInputBox key={i} className='inputBox' height={'60px'}>
                            <span className='notiEmoji'>{v.emoji}</span>
                            <span className='notiName'>{v.name}</span>
                            <span className='notiMapCnt'>{v.mapCnt}개의 테마</span>
                            <button className='closePopUp'>X</button>
                        </PageInputBox>
                    )
                })}
            </div>
        </NotiCon>
    );
});

export default Noti;