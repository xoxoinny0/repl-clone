import React, { memo } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';

const Item = styled.li`
    display: flex;
    flex-flow: row nowrap;
    padding: 10px;
    border-bottom: 1px solid lightgray;

    &:hover {
        cursor: pointer;
        background-color: #ccc;
    }

    &:last-child {
        border-bottom: none;
    }

    .recommend-Item__1 {
        flex: 0 0 auto;

        .img {
            width: 100px;
            height: 70px;
            object-fit: cover;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .recommend-Item__2 {
        flex: 2 1 auto;
        padding: 10px;

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        h4 {
            font-size: 18px;
            font-weight: 600;
            color: skyblue;
        }
        p {
            color: gray;
            font-weight: 500;
            font-size: 16px;
        }
    }

    .recommend-Item__3 {
        flex: 2 1 auto;

        display: flex;
        flex-flow: row nowrap;
        padding: 10px 5px;
        justify-content: flex-end;
        align-items: flex-end;

        p {
            margin: 0 10px;

            span {
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
`

const RecommendListItem = memo(props => {
    const emoji = useMemo(() => {
        switch (props.rating) {
            case 1: return '😫'; break;
            case 2: return '🥴'; break;
            case 3: return '😋'; break;
            case 4: return '🥰'; break;
            case 5: return '🤩'; break;
            default: return '😫'; break;
        }
    }, [props]);

    const onClick = useCallback(e => {
        e.preventDefault();
        props.modalOpen(e.currentTarget);
    }, [props]);

    return (
        <Item data-id={props.id} data-place_name={props.title} data-place_address={props.address} data-place_url={props.place_url} onClick={onClick}>
            <div className='recommend-Item__1'>
                {
                    props.img ? (
                        <img
                            className='img'
                            src={
                                `/thumbnail/thumb_${props.img.split('.')[0]}_480w.${props.img.split('.')[1]}`
                            }
                            alt={`${props.title} 후기 이미지`}
                        />
                    ) : (
                        <div className='img'>No Photo</div>
                    )
                }
            </div>
            <div className='recommend-Item__2'>
                <h4>{props.title}</h4>
                <p>{props.address}</p>
            </div>
            <div className='recommend-Item__3'>
                <p>후기 <span>{props.comment}</span></p>
                <p>{emoji} <span>{props.rating}</span></p>
            </div>
        </Item>
    );
});

export default RecommendListItem;