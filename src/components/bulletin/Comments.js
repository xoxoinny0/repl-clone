import React, { memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Spinner from '../../common/Spinner';
import cookieHelper from '../../helper/CookieHelper';

import { useSelector, useDispatch } from 'react-redux';
import { getComments, postComment } from '../../slices/bulletin/CommentsSlice';

import { useEffect } from 'react';
import { useMemo } from 'react';

const CommentsArea = styled.div`
    width: 800px;
    margin: auto;
    position: relative;
    padding-top: 40px;
    margin-bottom: 40px;

    .showButton {
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 20px;
        width: 100px;
        height: 40px;
        font-size: 14px;
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
            cursor: pointer;
            background-color: #eee;
        }

        span {
            margin: 0 10px;

            &:last-child {
                color: skyblue;
            }
        }
    }

    .comments__wrap {
        width: 100%;
        max-height: 0;
        transition: max-height 0.3s ease-out;
        overflow: hidden;
        box-sizing: border-box;

        .comments__title {
            font-size: 16px;
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
            
            span {
                color: skyblue;
                margin-left: 5px;
            }
        }

        .comments__profileImg {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .comments__list {
            width: 100%;
            padding: 10px;
            color: #636363;
            font-weight: 400;

            .comments__list__item {
                width: 100%;
                display: flex;
                flex-flow: row nowrap;
                border-bottom: 1px solid #eee;
                padding: 20px 0;
                box-sizing: border-box;
                
                .comments__contents {
                    margin-left: 15px;
                    font-size: 15px;

                    .comments__contents__top {
                        margin-bottom: 8px;

                        span {
                            margin-right: 10px;

                            &:last-child {
                                margin: none;
                                font-size: 14px;
                            }
                        }
                    }

                    .comments__contents__main {
                        line-height: 1.5;
                    }
                }
            }
        }

        .comments__add {
            width: 100%;
            padding: 10px;
            display: flex;
            flex-flow: row nowrap;
            margin-bottom: 50px;
            box-sizing: border-box;

            h1 {
                font-size: 40px;
                font-weight: 600;
                color: #aaa;
            }

            .connemts__add__inputBox {
                position: relative;
                width: 100%;
                margin-left: 15px;

                textarea {
                    width: 100%;
                    height: 100px;
                    resize: none;
                    font-size: 15px;
                    padding: 10px;
                    box-sizing: border-box;
                    line-height: 1.5;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                button {
                    position: absolute;
                    right: 15px;
                    bottom: 15px;
                    width: 60px;
                    height: 35px;
                    background: none;
                    border: 1px solid #ccc;
                    border-radius: 15px;

                    &:hover {
                        cursor: pointer;
                        background-color: #eee;
                    }
                }
            }
        }
    }
`;

const Comments = memo(props => {
    const navigate = useNavigate();

    /* 댓글 데이터 불러오기 */
    const { data, loading, error } = useSelector(state => state.CommentsSlice);
    const dispatch = useDispatch();

    const commentContainerRef = useRef();

    const id = props.id;
    const userInfo = useMemo(() => {
        const temp = cookieHelper.getCookie('loginInfo');
        if (temp) return JSON.parse(temp);
        else return null;
    }, [props])

    useEffect(() => {
        dispatch(getComments(id));
    }, [id]);

    const onCommentAddSubmit = useCallback(e => {
        e.preventDefault();

        if (!userInfo) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login/repl');
            } else {
                return;
            }
        }

        const userId = userInfo.id;

        const current = e.currentTarget;
        const value = current.commentsInput.value;
        current.commentsInput.value = '';

        (async () => {
            await dispatch(postComment({
                id: id,
                user_id: userId,
                content: value,
            }));

            await dispatch(getComments(id));

            const c = commentContainerRef.current;
            c.style.maxHeight = `${c.parentElement.scrollHeight + 60}px`;
        })();
    }, [id]);

    const onCommentsShowClick = useCallback(e => {
        const target = document.querySelector('.comments__wrap');
        if (target.style.maxHeight !== '0px' && target.style.maxHeight !== '') {
            target.style.maxHeight = '0px';
        } else {
            target.style.maxHeight = `${target.scrollHeight}px`;
        }
    }, []);

    return (
        <>
            <Spinner loading={loading} />
            {
                error ? (
                    <div>에러</div>
                ) : (
                    data && (
                        <CommentsArea>
                            <button className='showButton' onClick={onCommentsShowClick}><span>O</span>댓글<span>{data.length}</span></button>
                            <div className='comments__wrap' ref={commentContainerRef}>
                                <h4 className='comments__title'>댓글 <span>{data.length}</span></h4>
                                <ul className="comments__list">
                                    {
                                        data.map((v, i) => {
                                            return (
                                                <li className='comments__list__item' key={i}>
                                                    <h1>{v.icon}</h1>
                                                    <div className='comments__contents'>
                                                        <p className='comments__contents__top'>
                                                            <span>{v.username}</span>
                                                            <span>{v.commentdate}</span>
                                                        </p>
                                                        <p className='comments__contents__main'>
                                                            {v.content}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>

                                <form className="comments__add" onSubmit={onCommentAddSubmit}>
                                    {
                                        userInfo ? (
                                            <h1>{userInfo.icon}</h1>
                                        ) : (
                                            <h1>?</h1>
                                        )
                                    }

                                    <div className='connemts__add__inputBox'>
                                        <textarea name='commentsInput' placeholder='작성자에게 힘이 되는 댓글을 부탁드려요!' />
                                        <button type='submit'>확인</button>
                                    </div>
                                </form>
                            </div>
                        </CommentsArea>
                    )
                )
            }
        </>
    );
});

export default Comments;