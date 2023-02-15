/**
 *  후기 모달창에서 테마를 추가하기 위한 추가 모달창
 */
import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getThemeData } from "../../slices/ThemeSlice";

import { postTP } from "../../slices/MapThemeSlice";
import Spinner from "../../common/Spinner";
import cookieHelper from "../../helper/CookieHelper";

const MapAddModalContainer = styled.div`
  letter-spacing: -0.5px;
  color: #666666;
  line-height: 21.45px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;

  .theme_title {
    font-weight: 600;
    margin-bottom: 30px;
    letter-spacing: 1.5px;
    color: #0581bb;
  }

  .theme_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .theme {
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      width: 140px;
      transition: all 0.5s;

      &.active {
        background-color: #0581bb;
        color: white;
      }

      .theme_icon {
        font-size: 24px;
        margin-bottom: 10px;
        margin-top: 10px;
      }

      .theme_text {
        font-size: 12px;
      }

      &:hover {
        background-color: #58abd2;
        color: white;
      }
    }
  }

  .save {
    display: block;
    margin-top: 30px;
    font-size: 14px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    background-color: #ddd;
    box-shadow: rgba(0, 0, 0, 0.2) 3px 3px 8px 0px;
    line-height: 50px;
    transition: all 0.5s;
    cursor: pointer;
    text-decoration: none;

    &.can_save {
      background-color: #0581bb;
      color: rgb(254, 254, 254);
    }
  }

  .close {
    font-size: 13px;
    cursor: pointer;
    width: 100%;
    height: 31.45px;
    line-height: 31.45px;
    margin-top: 10px;
    color: #aaa;
    margin-bottom: 10px;

    &:hover {
      color: black;
    }
  }
`;

const ThemeModal2 = memo(({ modalIsOpen, onRequestClose, onClick, placeId, setTModal, themeList }) => {
  const dispatch = useDispatch();
  const { data: data2, loading: loading2, error: error2 } = useSelector((state) => state.ThemeSlice);
  const [btnActive, setBtnActive] = useState();

  useEffect(() => {
    dispatch(getThemeData());
  }, []);

  const onThemeClick = useCallback((e) => {
    console.log(e.currentTarget.dataset.id);
    setBtnActive(e.currentTarget.dataset.id);
  }, []);

  const onSaveClick = useCallback((e) => {
    let userInfo = cookieHelper.getCookie('loginInfo');
    let user_id = 0;
    if (userInfo) userInfo = JSON.parse(userInfo);
    if (userInfo?.id) user_id = userInfo.id;

    console.log(placeId);
    console.log(btnActive);
    dispatch(postTP({ place_id: placeId, theme_id: btnActive, user_id: user_id })).then((e) => {
      setTModal(false);
    });
  }, [btnActive]);

  const themeArr = [];
  themeList.forEach((v, i) => {
    themeArr.push(v.id);
  });

  return (
    <div>
      <Spinner loading={loading2} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onRequestClose}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(50, 50, 50, 0.75)",
            zIndex: 99999,
          },
          content: {
            textAlign: "center",
            backgroundColor: "#F8F8F8",
            width: "480px",
            height: "fit-content",
            borderRadius: "15px",
            padding: "30px 30px 15px",
            margin: "auto",
            overflowY: "hidden",
            overscrollBehavior: "contain",
          },
        }}>
        <MapAddModalContainer>
          <div className="theme_title">테마를 선택해주세요</div>
          <div className="theme_list">
            {data2?.map((v, i) => {
              if (!themeArr.includes(v.id))
                return (
                  <div key={i} data-id={v.id} className={`${"theme"} ${v.id == btnActive ? "active" : ""}`} onClick={onThemeClick}>
                    <div className="theme_icon">{v.icon}</div>
                    <div className="theme_text">{v.text}</div>
                  </div>
                );
            })}
          </div>
          <div className={`${"save"} ${btnActive ? "can_save" : ""}`} onClick={onSaveClick}>
            저장하기
          </div>
          <div className="close" onClick={onClick}>
            취소하기
          </div>
        </MapAddModalContainer>
      </Modal>
    </div>
  );
});

export default ThemeModal2;
