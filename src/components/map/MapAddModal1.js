import React, { memo, useCallback, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import { useSelector, useDispatch } from "react-redux";

import { modalOpen2, themeOpen, modalClose } from "../../slices/MapAddSlice";
import { postLoc } from "../../slices/MapSlice";
import { postTP } from "../../slices/MapThemeSlice";

import "animate.css";
import CookieHelper from "../../helper/CookieHelper";

export const MapAddModalContainer = styled.div`
  letter-spacing: -0.5px;
  color: #666666;
  line-height: 21.45px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;

  .place_name {
    width: 100%;
    font-size: 24px;
    color: #0581bb;
    font-weight: 600;
    margin-top: 30px;

    line-height: 145%;
  }

  .theme {
    a {
      text-decoration: none;
      font-weight: 600;
    }

    .icon {
      margin-bottom: -10px;
    }
    b {
      font-weight: 600;
      line-height: 24.75px;
      color: #da4c1f;
    }

    margin: 25px 0px 40px;
    font-size: 15px;
    color: #666;
    width: 100%;
  }

  .desc {
    font-size: 13px;
    color: #666666b3;
    margin-bottom: 20px;
  }

  .theme_select {
    color: red;
    cursor: pointer;
  }

  .save {
    font-size: 14px;
    width: 100%;
    height: 50px;
    background-color: #0581bb;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 3px 3px 8px 0px;
    color: rgb(254, 254, 254);
    line-height: 50px;
    cursor: pointer;

    &:hover {
      background-color: #0575a9;
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

const MapAddModal1 = memo(({ modalIsOpen, location, theme, AAT }) => {
  const dispatch = useDispatch();

  const onSaveClick = useCallback((e) => {
    const userInfo = CookieHelper.getCookie('loginInfo');
    let user_id = 0;
    if (userInfo) user_id = JSON.parse(userInfo).id;
    try {
      if (AAT) {
        console.group("테마 추가 : " + location?.place_name);
        console.log(location);
        console.groupEnd();
      } else {
        dispatch(postLoc({ location: location, theme: theme.id })).then(() => {
          dispatch(postTP({ user_id: user_id, place_id: location.id, theme_id: theme.id }));
        });
        console.group("장소 추가 : " + location?.place_name);
        console.log(location);
        console.groupEnd();
      }
    }
    catch (error) {
      window.alert('장소 추가에 실패했습니다.');
      return;
    }

    dispatch(modalOpen2());
  });

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => dispatch(modalClose())}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(50, 50, 50, 0.75)",
            zIndex: 99999,
          },
          content: {
            textAlign: "center",
            backgroundColor: "#F8F8F8",
            width: "290px",
            height: "fit-content",
            borderRadius: "15px",
            padding: "30px 30px 15px",
            margin: "auto",
            overflowY: "hidden",
            overscrollBehavior: "contain",
          },
        }}>
        <MapAddModalContainer>
          <div className="place_name">{location?.place_name}</div>
          <div className="theme">
            {theme ? (
              <div>
                {theme?.icon}
                <b> {theme?.text}</b>에 선택한 장소를 저장하시겠습니까?
              </div>
            ) : (
              <div>
                <div className="theme_select">테마를 선택해주세요.</div>
              </div>
            )}
          </div>
          <div className="desc">
            🔥
            <br />
            해당 테마에 이미 등록되어 있는 장소라면
            <br />
            리뷰와 사진이 추가됩니다.
          </div>
          <div className="save" onClick={onSaveClick}>
            저장하기
          </div>
          <div className="close" onClick={() => dispatch(modalClose())}>
            취소하기
          </div>
        </MapAddModalContainer>
      </Modal>
    </div>
  );
});

export default MapAddModal1;
