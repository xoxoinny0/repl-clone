import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { useEffect } from 'react';

const PostCard = styled.div`
    width: 260px;
    margin: 0 10px 15px;
    position: relative;
    box-sizing: border-box;
    box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
        cursor: pointer;
        box-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
        scale: 0.99;
    }
    
    .bg {
        width: 260px;
        height: 180px;
        margin-bottom: -2px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .post__title {
        padding: 5px;
        text-align: right;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.5;
        background-color: #0581bb;
        color: white;
    }

    .post__desc {
        background-color: white;

        h4 {
            padding: 10px;

            text-align: right;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.5;
        }

        .post__desc__other {
            margin-top: 10px;
            display: flex;
            flex-flow: row nowrap;
            padding: 10px;
            justify-content: space-between;
        }
    }

    .post__hashtags {
        text-align: right;
        padding: 10px;
        height: 36px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: lightgray;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;

        &:hover {
            background-color: #aaa;
        }

        span {
            margin-left: 5px;
        }
    }

    .hover__preview {
        opacity: 0;
        &.active {
            opacity: 1;
        }

        display: flex;
        flex-flow: column nowrap;
        width: 260px;
        height: 180px;
        background-color: #000000c8;
        color: white;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        transition: all 0.3s;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;

        &:hover {
            cursor: pointer;
        }

        h3 {
            font-size: 20px;
            font-weight: 600;
            
            &::before {
                content: '" ';
                display: inline-block;
            }
            &::after {
                content: ' "';
                display: inline-block;
            }
        }

        p {
            margin-top: 15px;
        }
    }
`

const Post = memo(props => {    
    const navigate = useNavigate();

    const [isHover, setIsHover] = useState(false);

    const onLinkClick = useCallback(e => {
        navigate(`/bulletin/${props.targetId}`);
    }, [props]);

    useEffect(() => {
        const targets = document.querySelectorAll('.post__hashtags');
        targets.forEach(v1 => {
            const values = v1.childNodes;
            let str = '';
            values.forEach(v2 => {
                str += ` ${v2.innerHTML}`;
            });
            v1.setAttribute('title', str);
        });
    }, [props]);

    return (
        <PostCard
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onLinkClick}
        >
            <div className={classNames('hover__preview', {active: isHover})}>
                <h3>{props.postTitle}</h3>
                <p>게시물 바로가기</p>
            </div>

            {
                props.backgroundImage ? (
                    <img
                        id='tets'
                        className='bg'
                        src={
                            `/thumbnail/thumb_${props.backgroundImage.split('.')[0]}_480w.${props.backgroundImage.split('.')[1]}`
                        }
                    alt="게시물 이미지"
                    />
                ) : (
                    <div className='bg' style={{backgroundColor: props.backgroundColor}} />
                )
            }
            <h3 className='post__title'>{props.postTitle}</h3>
            <div className='post__desc'>
                <h4>{props.postUser}</h4>
                <div className='post__desc__other'>
                    <p><span>좋아요</span> {props.like}</p>
                    <p>{props.postDate}</p>
                </div>
            </div>
            <div className='post__hashtags' title=''>
                {
                    props.selectedTags && props.selectedTags.map((v, i) => {
                        return (
                            <span key={i}>#{v}</span>
                        )
                    })
                }
            </div>
        </PostCard>
    );
});

export default Post;