import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

const SubjectBox = styled.div`
    width: 100%;
    margin-bottom: 20px;

    div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: bottom;
    }

    h4 {
        color: #0581BB;
        font-size: 18px;
        font-weight: 600;
    }

    .moreTags {
        display: none;
        &.show {
            display: inline-block;
        }

        border: none;
        background: none;
        color: #aaa;
        &.active {
            font-weight: 600;
            color: #000;
        }

        font-size: 12px;
        border-radius: 5px;
        padding: 3px 5px;
        margin-right: 15px;

        &:hover {
            cursor: pointer;
        }
    }

    ul {
        padding: -13px 5px 10px;
        width: 100%;
        max-height: 130px;
        overflow: hidden;
        box-sizing: border-box;
        transition: max-height 0.2s ease-out;
        margin-bottom: 30px;

        li {
            display: inline-block;
            background-color: #eee;
            &.active {
                background-color: #0581BB;
                color: white;
            }
            padding: 8px 10px;
            border-radius: 5px;
            font-size: 13px;
            margin: 13px 15px 0 0;

            transition: all 0.2s;

            &:hover {
                cursor: pointer;
                scale: 0.98;
            }
        }
    }
`;

const TagBox = memo(props => {
    /** 각 주제별 하위 태그들의 영역의 넘치지 않는지(더보기 필요한지) */
    const [isOver, setIsOver] = useState(false);
    /** 더보기 처리 위한 엘리먼트들 */
    const tagbox = useRef();
    const moreTags = useRef();

    // 렌더링 시 각 태그 영역이 더보기 해야할정도로 높은지 판별
    useEffect(() => {
        const target = tagbox.current;
        if (target.scrollHeight >= 150) {
            setIsOver(true);
        }
    }, []);

    // 더보기 클릭시 처리
    const onMoreTagsClick = useCallback(e => {
        e.preventDefault();

        const current = e.currentTarget;
        const target = current.closest('.tagbox').childNodes[1];

        current.classList.toggle('active');

        if (target.style.maxHeight !== '130px' && target.style.maxHeight !== '') {
            target.style.maxHeight = '130px';
        } else {
            target.style.maxHeight = `${target.scrollHeight}px`;
        }
    }, []);

    /** 해시태그 선택 처리 */
    const onHashtagClick = useCallback(e => {
        e.preventDefault();

        const current = e.currentTarget;
        current.classList.toggle('active');

        const value = current.innerHTML;
        const id = current.dataset.id;

        props.setSelectedTags(state => {
            let temp = [];
            for (const k of state) {
                temp.push(k);
            }
            const idx = temp.indexOf(value);
            if (idx !== -1) {
                temp = temp.splice(idx, 1);
            } else {
                temp.push(value);
            }

            return temp;
        });
        props.setSelectedTagID(state => {
            let temp = [];
            for (const k of state) {
                temp.push(k);
            }
            const idx = temp.indexOf(id);
            if (idx !== -1) {
                temp = temp.splice(idx, 1);
            } else {
                temp.push(id);
            }

            return temp;
        });
    }, [props]);

    return (
        <SubjectBox className='tagbox'>
            <div>
                <h4>{props.subject}</h4>
                <button className={classNames('moreTags', {show: isOver})} onClick={onMoreTagsClick} ref={moreTags}>더보기</button>
            </div>
            <ul ref={tagbox}>
                {
                    props.values.map((v, i) => {
                        return (
                            <li
                                key={i}
                                data-id={props.ids[i]}
                                onClick={onHashtagClick}
                                className={classNames({
                                    active: props.selectedTags.indexOf(v) !== -1
                                })}
                            >
                                {v}
                            </li>
                        )
                    })
                }
            </ul>
        </SubjectBox>
    );
});

export default TagBox;