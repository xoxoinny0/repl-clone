import React, { memo, useEffect } from 'react';
import PageContainer from '../../components/mypage/PageContainer';
import PageInputBox from '../../components/mypage/PageInputBox';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../slices/InfoSlice';

const TabMenu = styled.ul`
    /* background-color: #dcdcdc; */
    font-weight: bold;
    display: flex;
    width: 400px;
    margin: 30px auto;
    color: #424242;
    .submenu {
        width: 100%;
        padding: 15px 10px;
        cursor: pointer;
        margin: 0 auto;
        /* background-color: pink; */
        text-align: center;
        border-bottom: 2px solid #dcdcdc;

        &.focused {
            color: #0584BB;
            font-weight: bold;
            border-bottom: 2px solid #0584BB;
        }
    }
`;

const FollowCon = styled(PageContainer)`

    .contents {
        margin: 0 auto;
        /* background-color: pink; */
        /* width: 70%; */
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 50px;
        
        span {
            margin-right: 30px;
            font-size: 20px;
            /* background-color: pink; */
            line-height: 50px;
            color: #424242;
        }

        .mapCnt {
            font-size: 14px;
        }

        .followEmj {
            margin-left: 20px;
            display: inline-block;
            width: 30px;
            text-align: center;
        }

        .closePopUp {
            color: #424242;
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            font-size: 18px;
        
            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }

`

const Follow = memo(() => {

    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.InfoSlice);

    //팔로우/팔로워 탭 상태관리
    const [currentTab, setCurrentTab] = React.useState(0);

    useEffect(()=> {
        dispatch(getInfo());
    }, [dispatch])
    
    const selectMenuHandler = (index) => {
    setCurrentTab(index);
    };

    const idData = data?.find((v, i) => v.id === 2)

    return (
       <FollowCon>
            <h2>마이페이지 &gt; 팔로우/팔로잉</h2>

            <TabMenu>
                {idData?.follow.map((v, index)=>{
                    return (
                    <li
                        key={index}
                        className={currentTab === index ? "submenu focused" : "submenu"}
                        onClick={()=> selectMenuHandler(index)}
                        >
                    {v.name}
                    </li>
                    )
                })}
            </TabMenu>

            <div className='contents'>
                {idData?.follow[currentTab].list.map((v, i) => {
                    return (
                        <PageInputBox key={i} className='inputBox' height={'50px'}>
                            <span className='followEmj'>{v.emoji}</span>
                            <span>{v.name}</span>
                            <span className='mapCnt'>{v.mapCnt}개의 테마</span>
                            <button className='closePopUp'>X</button>
                        </PageInputBox>
                    )
                })}
            </div>
       </FollowCon>
    );
});

export default Follow;