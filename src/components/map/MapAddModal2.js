import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import { useSelector, useDispatch } from "react-redux";

import { modalOpen3, modalClose } from "../../slices/MapAddSlice";
import { addComment } from "../../slices/PlaceCommentSlice";

import cookieHelper from "../../helper/CookieHelper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import a1 from "../../assets/img/map/emoji-1-a.png";
import a2 from "../../assets/img/map/emoji-2-a.png";
import a3 from "../../assets/img/map/emoji-3-a.png";
import a4 from "../../assets/img/map/emoji-4-a.png";
import a5 from "../../assets/img/map/emoji-5-a.png";
import b1 from "../../assets/img/map/emoji-1-b.png";
import b2 from "../../assets/img/map/emoji-2-b.png";
import b3 from "../../assets/img/map/emoji-3-b.png";
import b4 from "../../assets/img/map/emoji-4-b.png";
import b5 from "../../assets/img/map/emoji-5-b.png";

const emoji = [a1, a2, a3, a4, a5, b1, b2, b3, b4, b5];

export const MapAddModalContainer = styled.form`
  letter-spacing: -0.5px;
  color: #666666;
  line-height: 21.45px;
  position: relative;
  -webkit-font-smoothing: antialiased;

  .place_name {
    width: 100%;
    font-size: 24px;
    color: #0581bb;
    font-weight: 600;
    margin-top: 30px;
    word-break: keep-all;
    line-height: 145%;
  }

  .theme {
    b {
      font-weight: 600;
      line-height: 24.75px;
    }

    margin: 25px 0px 30px;
    font-size: 15px;
    color: #666;
    width: 100%;
    height: 50px;
  }

  .desc {
    font-size: 13px;
    color: #666666b3;
    margin-bottom: 20px;
  }

  .emoji_list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .emoji_item {
      width: 45px;
      height: 45px;
      box-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
      cursor: pointer;
      background-color: #f8f8f8;
      padding: 11.5px;
      box-sizing: border-box;
      margin-bottom: 15px;
      border-radius: 12px;
      margin-right: 15px;
      transition: all 0.3s;

      &:nth-of-type(5n) {
        margin-right: 0;
      }
      img {
        width: 22px;
      }

      &:hover {
        background-color: #eee;
        cursor: pointer;
        box-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
        transition: all 0.4s;
      }

      &.active {
        background-color: #0581bb;
      }
    }
  }

  .text_list {
    display: flex;
    margin-bottom: 30px;

    .text_item {
      margin-right: 16.25px;
      width: 45px;
      font-size: 9px;
      color: #aaa;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .input_box {
    #comment_text {
      width: 100%;
      margin-bottom: 20px;
      height: 127.75px;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
      font-size: 13px;
      border-color: #e5e5e5;
      background-color: #fefefe;
      border-radius: 12px;
      overflow: auto;
      font-family: "S-CoreDream", "Spoqa Han Sans", Sans-serif;
      color: #666;
    }
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

  .next {
    font-size: 13px;
    cursor: pointer;
    width: 100%;
    height: 31.45px;
    line-height: 31.45px;
    margin-top: 10px;
    color: #aaa;
    margin-bottom: 10px;
  }
`;

const MapAddModal2 = memo(({ modalIsOpen, id }) => {
  const dispatch = useDispatch();

  const [rating, setRating] = useState();

  const onRatingClick = useCallback((e) => {
    const current = e.currentTarget;
    const index = current.dataset.rating;
    console.log("rating : " + (+index + 1));
    setRating(index);

    document.getElementById("comment_text")?.focus();
  });

  const onCommentSubmit = useCallback(e => {
    e.preventDefault();

    const rate = rating;
    const content = e.currentTarget.comment_text.value;

    console.log(rate, content, id);
    const userInfo = cookieHelper.getCookie('loginInfo');
    let user_id = 0;
    if (userInfo) user_id = JSON.parse(userInfo).id;

    dispatch(addComment({
      user_id: user_id,
      place_id: id,
      rating: rate,
      content: content
    })).then(() => {
      dispatch(modalOpen3());
    });
  }, [rating]);

  return (
    <Modal
      isOpen={modalIsOpen}
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
      <MapAddModalContainer onSubmit={onCommentSubmit}>
        <div className="place_name">
          🎉
          <br />
          큐레이팅 완료 !
        </div>
        <div className="theme">
          <b>이 장소에 대해 하고 싶은 이야기가 있나요?</b>
        </div>
        <div className="desc">
          아래 이모지를 눌러서
          <br />
          리플 커뮤니티에 의견을 남겨보세요!
        </div>
        <div className="emoji_list">
          {emoji?.map((v, i) => {
            if (i == rating) {
              return (
                <div key={i} className="emoji_item active" data-rating={i} onClick={onRatingClick}>
                  <img src={v} />
                </div>
              );
            } else {
              return (
                <div key={i} className="emoji_item" data-rating={i} onClick={onRatingClick}>
                  <img src={v} />
                </div>
              );
            }
          })}
        </div>

        <div className="text_list">
          <div className="text_item">ㅠㅠ</div>
          <div className="text_item">음..?</div>
          <div className="text_item">괜찮아요</div>
          <div className="text_item">좋았어요!</div>
          <div className="text_item">완벽해요!!</div>
        </div>

        {rating && (
          <div className="input_box">
            <textarea id="comment_text" name="comment_text" rows="4" placeholder="여기에 의견을 입력해주세요."></textarea>
          </div>
        )}

        <button type='submit' className="save">
          저장하기
        </button>
        <div className="next" onClick={() => dispatch(modalOpen3())}>
          건너뛰기
        </div>
      </MapAddModalContainer>
    </Modal>
  );
});

export default MapAddModal2;
