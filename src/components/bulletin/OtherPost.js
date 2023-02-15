import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Post = styled.div`
    min-width: 240px;
    height: 250px;
    background-color: #fff;
    margin: 0 10px;
    box-sizing: border-box;
    box-shadow: 0 0 6px rgb(0 0 0 / 20%);

    &:hover {
        cursor: pointer;
        filter: brightness(0.9);
        border: 1px solid #eee;
    }

    img,
    div {
        width: 100%;
        aspect-ratio: 10 / 6;
        object-fit: cover;
        object-position: 50% 50%;
        margin-bottom: 5px;
    }

    h4 {
        font-size: 18px;
        padding: 5px;
    }

    p {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical; 
        font-size: 12px;
        padding: 5px;
        line-height: 1.8;
    }
`

const OtherPost = memo(props => {
    const navigate = useNavigate();

    const onOtherPostClick = useCallback(e => {
        e.preventDefault();

        navigate(`${process.env.REACT_APP_BULLETIN_PATH}/${props.id}`);
    }, []);
    
    return (
        <Post onClick={onOtherPostClick}>
            {
                props.imgSrc ? (
                    <img
                        src={
                            `/thumbnail/thumb_${props.imgSrc.split('.')[0]}_480w.${props.imgSrc.split('.')[1]}`
                        }
                        alt="미리보기 사진"
                    />
                ) : (
                    <div style={{backgroundColor: props.bgColor}} />
                )
            }
            <h4>{props.title}</h4>
            <p>{props.preview.replace(/(<([^>]+)>)/gi, '')}</p>
        </Post>
    );
});

export default OtherPost;