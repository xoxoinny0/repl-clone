import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Comments from '../../components/bulletin/Comments';
import OtherPost from '../../components/bulletin/OtherPost';
import RecommendListItem from '../../components/bulletin/RecommendListItem';
import Spinner from '../../common/Spinner';
import cookieHelper from '../../helper/CookieHelper';
import LocModal from "../../common/LocModal";

import { getPost } from '../../slices/bulletin/PostViewSlice';
import { getOtherPosts } from '../../slices/bulletin/OtherPostSlice';
import { getRecommendedPlaces } from '../../slices/bulletin/RecommendedPlaceSlice';
import { getPostsTags } from '../../slices/bulletin/HashtagSlice';
import { useSelector, useDispatch } from 'react-redux';

const TitleArea = styled.div`
    width: 100%;
    margin: auto;
    height: 400px;
    position: relative;
    background-color: ${props => props.bgColor};
    border-bottom: 1px solid #eee;

    .title {
        width: 500px;
        height: 150px;
        background-color: #00000022;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        box-sizing: border-box;
        padding: 10px;

        h2 {
            color: white;
            padding: 10px;
        }

        .title__main-title {
            width: 480px;
            height: 70px;
            font-size: 40px;
        }

        .title__desc {
            width: 100%;
            height: 40px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;

            h3 {
                color: white;
                font-size: 20px;
                padding: 10px;
            }
        }
    }
`;

const PostingArea = styled.section`
    width: 100%;
    padding: 20px;
    margin: auto;
    box-sizing: border-box;

    .postContent {
        width: 800px;
        margin: auto;
        padding: 50px 10px 100px;
        box-sizing: border-box;
        border-bottom: 1px solid #aaa;
        margin-bottom: 40px;
    }
`;

const RecommendPlaceArea = styled.div`
    width: 800px;
    margin: auto;
    margin-bottom: 40px;

    .recommend-place-top {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 20px;
        padding: 0 10px;

        h3 {
            font-size: 20px;
            font-weight: 600;
        }
    }

    .recommend-place-body {
        width: 100%;
        box-sizing: border-box;
    }
`;

const CategoryArea = styled.div`
    width: 800px;
    margin: auto;
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 20px;

    .category-tags {
        flex: 2 1 auto;

        span {
            display: inline-block;
            font-size: 12px;
            padding: 5px;
            border-radius: 5px;
            background-color: #eee;
            margin-right: 15px;
            margin-bottom: 10px;

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }
`;

const PublisherDiv = styled.div`
    width: 800px;
    height: 50px;
    margin: auto;
    display: flex;
    flex-flow: row nowrap;
    background-color: #eee;
    margin-bottom: 50px;
    padding: 10px;
    justify-content: space-between;

    div {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-end;
    }

    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;

        &:hover {
            cursor: pointer;
            filter: brightness(0.8);
        }
    }

    h1 {
        font-size: 40px;
    }

    h2 {
        font-size: 24px;
        margin-left: 15px;
        font-weight: 600;

        &:hover {
            cursor: pointer;
        }
    }

    p {
        margin-right: 15px;
        font-size: 16px;

        span {
            font-size: 18px;
            margin-left: 5px;
        }
    }

    button {
        border: 1px solid #ccc;
        background-color: #fff;
        width: 100px;
        height: 40px;
        border-radius: 20px;
        color: skyblue;
        
        &:hover {
            cursor: pointer;
            background-color: #eee;
        }

        &.unfollow {
            color: tomato;
        }
    }
`;

const OtherPostsArea = styled.div`
    width: 800px;
    margin: auto;

    h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .other-posts {
        width: 100%;
        padding: 10px;
        display: flex;
        flex-flow: row nowrap;
        position: relative;
        box-sizing: border-box;

        .other_posts__wrap {
            width: 800px;
            margin: auto;
            display: flex;
            flex-flow: row nowrap;
            overflow-x: scroll;
            overflow-y: hidden;
            scroll-behavior: smooth;
            
            ::-webkit-scrollbar {
                display: none;
            }
        }

        button {
            display: none;
            &.active {
                display: block;
            }

            width: 15px;
            height: 250px;
            border: none;
            background-color: #00000020;
            color: #fff;
            font-size: 25px;
            font-weight: 600;
            position: absolute;
            &:first-child {
                left: 5px;
            }
            &:last-child {
                right: 5px;
            }

            &:hover {
                cursor: pointer;
                background-color: #00000040;
            }
        }
    }
`;

const NewPost = memo(props => {
    const navigate = useNavigate();

    /** 게시글 데이터 불러오기 */
    const dispatch = useDispatch();
    // 게시글 본문 및 작성자 데이터
    const { data, loading, error } = useSelector(state => state.PostViewSlice);
    // 본 게시물에서 작성자가 추천한 장소들 데이터
    const { data: places, loading: loading2, error: error2 } = useSelector(state => state.RecommendedPlaceSlice);
    // 본 게시물에서 작성자가 선정한 카테고리들 데이터
    const { data: categories, loading: loading3, error: error3 } = useSelector(state => state.HashtagSlice);
    // 작성자의 다른 게시글들 데이터
    const { data: otherPosts, loading: loading4, error: error4 } = useSelector(state => state.OtherPostSlice);

// 패스파라미터 변수
    const postId = useParams().id;

    // 팔로우 여부
    const [isFollowed, setIsFollowed] = useState(false);

    // 해당 패스 게시글 불러오기
    useEffect(() => {
        dispatch(getPost(postId));
    }, [postId]);

    // 게시글 데이터 적재 완료시 2차 데이터 불러오기
    useEffect(() => {
        console.log(data);
        if (data) {
            dispatch(getRecommendedPlaces(postId));
            dispatch(getPostsTags(postId));
            dispatch(getOtherPosts(data.userId));

            const target = document.querySelector('#titleArea');
            if (data.bgimage) {
                target.setAttribute('style', `
                    background-image: url(/upload/${data.bgimage});
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: cover;
                `);
            } else {
                target.setAttribute('style', `
                    background-color: ${data.bgcolor}
                `);
            }
        }
    }, [data]);

    useEffect(() => {
        console.log(places);
    }, [places]);

    // 로그인 여부에 따라 팔로우 정보 처리
    useEffect(() => {
        const loginInfo = cookieHelper.getCookie('loginInfo');

        if (data && loginInfo) {
            setIsFollowed(data?.follower?.findIndex(v => {
                return v === JSON.parse(loginInfo).id;
            }) > -1);
        }
    }, [data]);

    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달창 이벤트
    const modalOpen = useCallback(current => {
        setModalContent({ id: current.dataset.id, place_name: current.dataset.place_name, address_name: current.dataset.place_address, place_url: current.dataset.place_url });
        setIsModalOpen(true);
    }, []);

    useEffect(() => {
        if (isModalOpen) {
          document.body.style.cssText = `
                position: fixed; 
                top: -${window.scrollY}px;
                overflow-y: scroll;
                width: 100%;
            `;
        } else {
          const scrollY = document.body.style.top;
          document.body.style.cssText = "";
          window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        }
      }, [isModalOpen]);

    // 팔로우/언팔로우 클릭시 이벤트
    const onFollowClick = useCallback(e => {
        e.preventDefault();

        let loginInfo = cookieHelper.getCookie('loginInfo');
        if (!loginInfo) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login/repl');
                return;
            } else {
                return;
            }
        }

        loginInfo = JSON.parse(loginInfo);
        if (data.userId === loginInfo.id) return;

        const params = {};
        params.follow_from = loginInfo.id;
        params.follow_to = data.userId;

        if (isFollowed) axios.post(`${process.env.REACT_APP_BULLETIN_PATH}/unfollow`, params);
        else axios.post(`${process.env.REACT_APP_BULLETIN_PATH}/follow`, params);

        setIsFollowed(state => !state);
    }, [data, isFollowed]);

    /** 작성자의 다른 게시글 영역 좌우 스크롤 관련*/
    // 현재 스크롤 위치 저장
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    // 왼쪽 오른쪽 버튼
    const toLeft = useRef();
    const toRight = useRef();

    // 최대 길이 적재
    useEffect(() => {
        if (!otherPosts) return;
        const target = document.querySelector('.other_posts__wrap');
        setMaxScroll(target?.scrollWidth);
    }, [otherPosts]);

    // 좌 우 클릭
    const onToRightClick = useCallback(e => {
        e.preventDefault();
        e.currentTarget.setAttribute('disabled', 'disabled');
        const target = document.querySelector('.other_posts__wrap');
        target.scrollLeft += 780;
        setScrollPosition(state => state + 780);
        const current = e.currentTarget;
        setTimeout(() => {
            current.removeAttribute('disabled');
        }, 500);
    }, []);
    const onToLeftClick = useCallback(e => {
        e.preventDefault();
        e.currentTarget.setAttribute('disabled', 'disabled');
        const target = document.querySelector('.other_posts__wrap');
        target.scrollLeft -= 780;
        setScrollPosition(state => state - 780);
        const current = e.currentTarget;
        setTimeout(() => {
            current.removeAttribute('disabled');
        }, 500);
    }, []);

    return (
        <>  
            {
                loading ? (
                    <Spinner loading={loading} />
                ) : (
                    error ? (
                        <div>에러</div>
                    ) : (
                        data && <>
                            <TitleArea id='titleArea' bgColor={data.bgColor}>
                                <div className='title'>
                                    <h2 className='title__main-title'>{data.title}</h2>
                                    <div className='title__desc'>
                                        <h3>{data.username}</h3>
                                        <h3>{data.postdate}</h3>
                                    </div>
                                </div>
                            </TitleArea>

                            <hr />

                            <PostingArea>
                                <div className="postContent" dangerouslySetInnerHTML={{ __html: data.content}} />
                                <RecommendPlaceArea>
                                    <div className='recommend-place-top'>
                                        <h3>이 글에서 추천한 장소들</h3>
                                    </div>
                                    <div className='recommend-place-body'>
                                        <Spinner loading={loading2} />
                                        {
                                            error2 ? (
                                                <div>추천된 장소 목록을 불러오지 못했습니다.</div>
                                            ) : (
                                                <ul>
                                                    {
                                                        places && places.map((v, i) => {
                                                            return (
                                                                <RecommendListItem
                                                                    key={i}
                                                                    id={v.id}
                                                                    img={v.img}
                                                                    title={v.place_name}
                                                                    address={v.address_name}
                                                                    comment={v.comment}
                                                                    rating={v.rating}
                                                                    place_url={v.place_url}
                                                                    modalOpen={modalOpen}
                                                                />
                                                            );
                                                        })
                                                    }
                                                    {
                                                        isModalOpen ? 
                                                        <LocModal
                                                            isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} 
                                                            style={{ content: { 
                                                            width: "300px" } }}
                                                            data={modalContent}
                                                        /> : <></>
                                                    }
                                                </ul>
                                            )
                                        }
                                    </div>
                                </RecommendPlaceArea>

                                <CategoryArea>
                                    <div className='category-tags'>
                                        {
                                            categories && categories.map((v, i) => {
                                                return (
                                                    <span key={i} onClick={e => {
                                                        e.preventDefault();
                                                        navigate(`/bulletin?tag=${v.id}`);
                                                    }}>{v.name}</span>
                                                );
                                            })
                                        }
                                    </div>
                                </CategoryArea>

                                <Comments id={postId} />
                            </PostingArea>

                            <PublisherDiv>
                                <div>
                                    <h1>{data.icon}</h1>
                                    <h2>{data.username}</h2>
                                </div>
                                <div>
                                    <p>팔로워<span>{data?.follower?.length}</span></p>
                                    {
                                        isFollowed ? (
                                            <button className='unfollow' onClick={onFollowClick}>언필로우</button>
                                        ) : (
                                            <button className='follow' onClick={onFollowClick}>필로우</button>
                                        )
                                    }
                                </div>
                            </PublisherDiv>
                                
                            <OtherPostsArea>
                                <Spinner loading={loading4} />
                                {
                                    error4 ? (
                                        <div>작성자의 다른 게시글을 불러오지 못했습니다.</div>
                                    ) : (
                                        <>
                                            <h3>작성자의 다른 게시글</h3>
                                            <div className="other-posts">
                                                <button className={classNames({active: scrollPosition > 0})} ref={toLeft} onClick={onToLeftClick}>&lt;</button>
                                                <div className='other_posts__wrap'>
                                                    {
                                                        otherPosts && otherPosts.map((v, i) => {
                                                            if (postId !== v.id)
                                                            return (
                                                                <OtherPost
                                                                    key={i}
                                                                    id={v.id}
                                                                    imgSrc={v.bgimage}
                                                                    bgColor={v.bgColor}
                                                                    title={v.title} preview={v.content}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <button className={classNames({active: scrollPosition < maxScroll - 900})} ref={toRight} onClick={onToRightClick}>&gt;</button>
                                            </div>
                                        </>
                                    )
                                }
                            </OtherPostsArea>
                        </>
                    )
                )
            }
        </>
    );
});

export default NewPost;