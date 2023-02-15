import React, { memo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import PageContainer from '../../components/mypage/PageContainer';
import PageInputBox from '../../components/mypage/PageInputBox';
import PageButton from '../../components/mypage/PageButton';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../slices/InfoSlice';

const MyMapInputBox = styled.button`
    width: ${(props) => props.width || '350px'};
    height: ${(props) => props.height || '40px'};
    border-radius: 10px;
    box-shadow: 2px 2px 5px #DADADA;
    font-size: 13px;
    color: #0584BB;
    font-weight: bold;
    line-height: 2.5;
    padding: 0 10px;
    margin-bottom: 20px;
    cursor: pointer;
    border: none;
    background-color: white;

    .myMapIcon {
        font-size: 17px;
    }

    &:hover {
        box-shadow: 1px 2px 5px #a4a4a4;
        transition: all 0.2s;
    }

    .bookmarkBtn {
        text-align: left;

        .imj {
            margin: 0 10px;
        }

        .placeCnt {
            margin-left: 10px;
            font-size: 11px;
            color: grey;
        }
    }
`

const MapBox = styled(PageContainer)`

    height: 100vh;
    
    h2 {
        padding-bottom: 100px;
    }

    

    .mapCon {
        display: flex;
        /* background-color: #eee; */
        justify-content: center;
        margin: 0 auto;
        
        h3 {
            margin-bottom: 30px;
            font-size: 17px;
            font-weight: bold;
            color: #424242;
        }

        p {
            margin-top : 30px;

            .b {
                font-weight: bold;
                line-height: 23px;
            }
            span {
                font-size: 13px;
                color: #606060;

            }
        }

        .mapButton {
            margin-top: 30px;
        }


        .theme {
            width: 330px;
            /* background-color: pink; */
            margin-right: 70px;

            
            
        }

        .curation {
            /* background-color: beige; */
            width: 330px;
        }
    }

`

const Map = memo(() => {

    const navigate = useNavigate();
    
    //info data 가져오기
    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.InfoSlice);
    
    useEffect(()=> {
        dispatch(getInfo());
    }, [dispatch])
    
    //로그인된 id 데이터 가져오기
    const idData = data?.find((v, i) => v.id === 2)

    // console.log("idData", idData);


    // 지도찾기로 이동하는 함수
    const onClickFindMap = useCallback((e)=> {
        let redirectUrl = '/map_finder';
        navigate(redirectUrl);
    }, [navigate])

    //내 테마지도로 이동하는 함수
    const onClickMyMap = useCallback((e)=> {
        let id = 2;
        let redirectUrl = `/map/curator/${id}`;
        navigate(redirectUrl);
    },[navigate])

    //찜한 지도로 이동하는 함수 (경로 필요)
    const onClickLike = useCallback((e)=> {
        let id = 2;
        let redirectUrl = `/map/curator/${id}`;
        navigate(redirectUrl);
    }, [navigate]);

    return (
        <MapBox>
            <h2>마이페이지 &gt; 나의 지도 관리</h2>
            <div className='mapCon'>
                <div className='theme'>
                    <h3>🗺 나의 테마지도 모아보기</h3>
                    <MyMapInputBox width={'300px'} height={'120px'} onClick={onClickMyMap}>
                        <div className='myMapIcon'>{idData?.icon}</div>
                        <div>
                            {`${idData?.eName}님의 리플`}
                        </div>
                    </MyMapInputBox>
                    <p>
                        <span className='b'>🕵️‍♂️ 여러분이 생각하는 최고의 장소들로 이루어진 지도를 만들어보세요.</span><br/>                          
                        <span>- 테마지도에 등록한 내 장소를 모아서 볼 수 있습니다.</span><br/>
                        <span>- 아래의 버튼을 클릭해서 테마를 둘러보고 큐레이션을 시작해보세요.</span><br/>                   
                        <span>- 원하는 테마를 직접 만들 수도 있습니다.</span><br/>
                        
                    </p>
                    <PageButton className='mapButton' width={'300px'} height={'44px'} onClick={onClickFindMap}>테마지도 보러가기</PageButton>
                </div>
                <div className='curation'>
                    <h3>🏕 내가 찜한 지도</h3>
                    <MyMapInputBox width={'300px'} height={'50px'} onClick={onClickLike}>
                        <div className='bookmarkBtn'>
                            <span className='imj'>❤️</span>
                            <span>
                                내가 좋아하는 장소들
                            </span>
                            <span className='placeCnt'>1개의 장소</span>
                        </div>
                    </MyMapInputBox>
                    
                    <p>
                        <span className='b'>🕵️‍♂️ 내가 북마크한 장소를 확인할 수 있어요.</span><br/>
                        <span>- 마음에 드는 장소를 북마크 할 수 있습니다.</span><br/>
                        <br/>
                    </p>
                    
                </div>
            </div>
        </MapBox>
    );
});

export default Map;