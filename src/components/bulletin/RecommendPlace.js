import React, { memo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { useSelector, useDispatch } from 'react-redux';
import { getMyPlace } from '../../slices/bulletin/RecommendPlaceSlice';

import Modal from 'react-modal';

import breadSample from '../../assets/img/bulletin/bread_sample.jpg';
import CookieHelper from '../../helper/CookieHelper';

const modalStyle = {
    overlay: {
        backgroundColor: "rgba(50, 50, 50, 0.75)",
        zIndex: 99999,          
    },
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '500px',
        padding: '0',
        border: 'none',
    },
};

const PopUpBox = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;

    .closePopUp {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        font-size: 25px;
        
        &:hover {
            cursor: pointer;
            background-color: #ccc;
        }
    }

    .top-desc {
        margin-bottom: 15px;

        h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        p {
            font-size: 12px;
        }
    }

    .selected-place {
        width: 100%;
        margin: auto;
        min-height: 100px;
        background-color: #eee;
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        border-radius: 2px;

        p {
            font-size: 14px;
            display: inline-block;
            margin-right: 10px;
        }

        span {
            display: inline-block;
            background-color: #ccc;
            padding: 2px;
            margin: 0 10px 10px 0;
            border-radius: 3px;
            font-size: 12px;

            button {
                background: none;
                border: none;
                margin: 0 2px 0 2px;
                font-size: 10px;

                &:hover {
                    cursor: pointer;
                    font-weight: 600;
                }
            }
        }
    }

    .search {
        display: flex;
        flex-flow: row nowrap;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        margin-bottom: 10px;
        
        * {
            line-height: 1.6;
            padding: 5px;
            border-radius: 2px;
            background-color: #eee;
            font-size: 12px;
        }

        div {
            flex: 1 1 auto;
            padding: 5px;
            margin-right: 5px;
            display: flex;
            flex-flow: row nowrap;

            input {
                flex: 1 1 auto;
                border: none;
                background: none;
            }
        }

        button {
            border: none;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .searched-list {
        width: 100%;
        max-height: 250px;
        box-sizing: border-box;
        padding-bottom: 15px;
        overflow-y: scroll;
        ::-webkit-scrollbar { 
            width: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #777;
            border-radius: 3px;
        }
        ::-webkit-scrollbar-track { 
            background: none;
        }

        li {
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            flex-flow: row nowrap;
            transition: all 0.2s;

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }

            &.active {
                background-color: #0581bb;
                
                div {
                    h4, p { color: white; }
                }
            }

            .img {
                width: 90px;
                height: 60px;
                object-fit: cover;
                margin-right: 20px;
            }

            div {
                display: flex;
                flex-flow: column wrap;
                justify-content: space-between;
                padding: 5px 0;
                padding-bottom: 10px;

                h4 {
                    color: skyblue;
                    font-weight: 600;
                    font-size: 18px;
                }

                p {
                    font-size: 14px;
                    color: darkgray;
                }
            }
        }
    }
`;

const RecommendPlace = memo(props => {
    /** slice 연동, 내가 리뷰한 장소 목록 불러오기 */
    const { data, loading, error } = useSelector(state => state.RecommendPlaceSlice);
    const dispatch = useDispatch();

    // 처음 내가 쓴 전체 게시글 불러오기
    useEffect(() => {
        const userInfo = CookieHelper.getCookie('loginInfo');
        let user_id = 0;
        if (userInfo) user_id = JSON.parse(userInfo).id;
        dispatch(getMyPlace(user_id));
    }, []);

    /** 장소 선택하기 */
    // 선택 장소 정보 저장
    const [selectedIndex, setSelectedIndex] = useState([]);
    // 장소 검색 input data 저장
    const [keyword, setKeyword] = useState('');

    // 내 리뷰 남긴 장소 수만큼 배열 생성
    useEffect(() => {
        if (data) setSelectedIndex(new Array(data.length).fill(false));
    }, [data]);

    // 검색창 초기화(비우기, 목록 전체로 갱신)
    const resetForm = useCallback(e => {
        e.preventDefault();
        const target =  e.currentTarget.closest('div').childNodes[0].childNodes[0];
        target.value = '';
        target.innerHTML = '';
        setKeyword(state => null);
    }, []);

    // 각 장소 눌렀을 때
    const onPlaceClick = useCallback(e => {
        e.preventDefault();

        // 선택된 장소 인덱스 저장하는 state 해당 위치 boolean 반전
        const idx = e.currentTarget.dataset.idx;
        setSelectedIndex(state => {
            let temp = [];
            for (const k of state) {
                temp.push(k);
            }
            temp[idx] = !temp[idx];
            return temp;
        });
    }, []);

    // 선택된 장소에서 x 버튼 눌러서 없애기 했을 때
    const onDeletePlaceClick = useCallback(e => {
        e.preventDefault();

        const idx = e.currentTarget.closest('span').dataset.idx;
        setSelectedIndex(state => {
            let temp = [];
            for (const k of state) {
                temp.push(k);
            }
            temp[idx] = !temp[idx];
            return temp;
        });
    }, []);

    // 장소 검색
    const onSearchPlace = useCallback(e => {
        e?.preventDefault();

        const value = document.querySelector('.search').childNodes[0].childNodes[0].value.trim();
        if (value === null || value ==='') {
            setKeyword(state => null);
            return;
        };

        setKeyword(state => value);
    }, []);

    useEffect(() => {
        // 갱신된 선택 목록 state에 set
        const items = [];
        for (let i = 0; i < selectedIndex.length; i++) {
            if (selectedIndex[i] === true) {
                items.push(data[i]);
            }
        }

        props.setSelectedPlaces(state => items);
    }, [selectedIndex]);

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.closeModal}
            style={modalStyle}
            ariaHideApp={false}
        >
            <PopUpBox>
                <button className='closePopUp' onClick={props.closeModal}>X</button>
                <div className='top-desc'>
                    <h3>추천할 장소를 찾아보세요</h3>
                    <p>자신이 리뷰를 남긴 장소에서 선택 가능해요</p>
                </div>
                <div className='selected-place'>
                    <p>선택된 장소 목록 : </p>
                    {
                        selectedIndex.map((v, i) => {
                            if (v === true) {
                                return (
                                    <span key={i} data-idx={i}>{data[i].place_name} <button onClick={onDeletePlaceClick}>X</button></span> 
                                )
                            } else return '';
                        })
                    }
                </div>
                <div className='search'>
                    <div>
                        <input type="text" name="keywordInput"
                            onKeyDown={e => {
                                if (e.key === 'Enter') onSearchPlace();
                            }}
                        ></input>
                        <button type='button' onClick={onSearchPlace}>
                            O 검색
                        </button>
                    </div>
                    <button type='button' onClick={resetForm}>초기화</button>
                </div>
                <ul className='searched-list'>
                    {
                        keyword ? (
                            data && data.map((v, i) => {
                                if (v.place_name.indexOf(keyword) !== -1) {
                                    return (
                                        <li key={i} data-idx={i} onClick={onPlaceClick} className={classNames({active: selectedIndex[i]})}>
                                            {
                                                v?.place_img ? (
                                                    <img
                                                        className='img' src={
                                                            `/thumbnail/thumb_${v.place_img.split('.')[0]}_480w.${v.place_img.split('.')[1]}`
                                                        }
                                                        alt="장소 사진"
                                                    />
                                                ) : (
                                                    <div className='img' >NO PHOTO</div>
                                                )
                                            }
                                            <div>
                                                <h4>{v.place_name}</h4>
                                                {
                                                    v.road_address_name ? (
                                                        <p>{v.road_address_name}</p>
                                                        ) : (
                                                            <p>{v.address_name}</p>
                                                        )
                                                }
                                            </div>
                                        </li>
                                    );
                                } else return '';
                            })
                        ) : (
                            data && data.map((v, i) => {
                                return (
                                    <li key={i} data-idx={i} onClick={onPlaceClick} className={classNames({active: selectedIndex[i]})}>
                                        {
                                            v?.place_img ? (
                                                <img
                                                    className='img' src={
                                                        `/thumbnail/thumb_${v.place_img.split('.')[0]}_480w.${v.place_img.split('.')[1]}`
                                                    }
                                                    alt="장소 사진"
                                                />
                                            ) : (
                                                <div className='img' >NO PHOTO</div>
                                            )
                                        }
                                        <div>
                                            <h4>{v.place_name}</h4>
                                            {
                                                v.road_address_name ? (
                                                    <p>{v.road_address_name}</p>
                                                    ) : (
                                                        <p>{v.address_name}</p>
                                                    )
                                            }
                                        </div>
                                    </li>
                                );
                            })
                        )
                    }
                </ul>
            </PopUpBox>
        </Modal>
    );
});

export default RecommendPlace;