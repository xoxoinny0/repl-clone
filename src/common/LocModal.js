import React, { memo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import cookieHelper from '../helper/CookieHelper';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faBookmark } from "@fortawesome/free-solid-svg-icons"; // 속이 찬 북마크
import { faBookmark as faBookmark2 } from "@fortawesome/free-regular-svg-icons"; // 속이 빈 북마크

import iconPlus from "../assets/img/map/icon-plus-grey-sm.svg";

import breadSample from "../assets/img/bulletin/bread_sample.jpg";

import ThemeModal2 from "../components/map/ThemeModal2";

import { getThemeData } from "../slices/ThemeSlice";
import { getTP } from "../slices/MapThemeSlice";
import { getBookmarkItem, postBookmark, delBookmark } from "../slices/BookmarkSlice";

import { getComment, addComment } from "../slices/PlaceCommentSlice";
import { getPost } from "../slices/PlacePostSlice";
import { getPlacePhotos, addPlacePhotos } from "../slices/PlacePhotoSlice";

import a1 from "../assets/img/map/emoji-1-a.png";
import a2 from "../assets/img/map/emoji-2-a.png";
import a3 from "../assets/img/map/emoji-3-a.png";
import a4 from "../assets/img/map/emoji-4-a.png";
import a5 from "../assets/img/map/emoji-5-a.png";
import b1 from "../assets/img/map/emoji-1-b.png";
import b2 from "../assets/img/map/emoji-2-b.png";
import b3 from "../assets/img/map/emoji-3-b.png";
import b4 from "../assets/img/map/emoji-4-b.png";
import b5 from "../assets/img/map/emoji-5-b.png";
import Spinner from "./Spinner";

const emoji = [a1, a2, a3, a4, a5, b1, b2, b3, b4, b5];

export const LocModalContainer = styled.div`
  letter-spacing: -0.5px;
  color: #666666;
  line-height: 21.45px;

  .modal-header {
    padding: 0 0 20px;
    position: relative;
    h3 {
      color: #0581bb;
      font-weight: 900;
      font-size: 20px;
      margin-bottom: 6px;
    }

    span {
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: black;
      }
    }

    .faX {
      font-size: 30px;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  }

  .modal-body {
    height: 700px;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .modal-img-container {
      width: 700px;
      height: 160px;
      background-color: #e5e5e5;
      text-align: center;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 20px;
      border-radius: 10px;

      .icon {
        margin-bottom: 10px;
      }

      .text {
        font-size: 13px;
        font-weight: 400;
        line-height: 21.45px;
      }
    }

    .place-photos {
      width: 700px;
      height: 160px;
      display: flex;
      margin-bottom: 20px;
      border-radius: 10px;

      .place-photos__add-button {
        width: 130px;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 10px;
        background-color: #e5e5e5;
        margin-right: 10px;

        &:hover {
          cursor: pointer;
        }
      }

      .place-photos__list {
        width: 560px;
        height: 160px;

        display: flex;
        flex-flow: row nowrap;

        overflow-y: hidden;
        box-sizing: border-box;

        ::-webkit-scrollbar { 
          height: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #aaaaaa;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-track { 
          background: none;
        }

        img {
          height: 160px;
          object-fit: cover;
          background-repeat: no-repeat;
          margin-right: 10px;

          &:last-child {
            margin: 0;
          }

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .modal-info-container {
      display: flex;

      .info {
        width: 50%;
        padding-right: 20px;

        &:last-of-type {
          padding-right: 0;
          padding-left: 20px;
        }

        .info-item {
          margin-bottom: 30px;

          .review_item {
            margin-bottom: 20px;
            width: 280px;
            border-radius: 12px;
            padding: 17px 20px 15px;
            background-color: #fefefe;
            box-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
            position: relative;
            font-size: 13px;

            .review_emoji {
              position: absolute;
              top: -11px;
              left: 20px;

              img {
                width: 22px;
              }
            }
          }

          .theme-card {
            margin: 8px 0;
            font-size: 13px;
            width: 320px;
            height: 51.5px;
            padding: 15px 20px;
            box-sizing: border-box;
            box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
            border-radius: 12px;

            &.center {
              text-align: center;
              cursor: pointer;

              &:hover {
                background-color: #eee;
              }
            }
          }

          .theme-card__about {
            transition: all 0.3s;

            &:hover {
              cursor: pointer;
              background-color: #eee;
            }
          }
        }

        .comment {
          display: flex;
          flex-flow: row wrap;

          .comment__emojies {
            input[type="radio"] {
              display: none;
            }
            label {
              display: inline-block;
              width: 50px;
              height: 50px;
              border-radius: 12px;
              margin: 0 16px 15px 0;
              box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
              line-height: 50px;
              text-align: center;
              padding: 10px;
              box-sizing: border-box;

              &:hover {
                background-color: #eee;
                cursor: pointer;
                box-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
                transition: all 0.4s;
              }

              &.active {
                background-color: #0581bb;
              }

              img {
                width: 30px;
              }
            }
          }

          .comment__desc {
            margin-bottom: 20px;

            span {
              font-size: 12px;
              color: #aaa;
              display: inline-block;
              width: 50px;
              margin-right: 16px;
              letter-spacing: -1px;
              text-align: center;
              overflow-x: hidden;
            }
          }

          .comment__contents {
            max-height: 0px;
            overflow: hidden;
            transition: all 0.3s;

            .comment__input {
              width: 320px;
              resize: none;
              border: 2px solid #aaa;
              border-radius: 12px;
              padding: 20px;
              box-sizing: border-box;
              margin-bottom: 20px;

              ::placeholder {
                color: #bbb;
              }
            }
          }

          .comment__submit-button {
            width: 320px;
            height: 40px;
            border: none;
            border-radius: 12px;
            background-color: #ddd;
            color: #aaa;
            font-size: 12px;
            font-weight: 600;

            &.active {
              background-color: white;
              color: #000;
              box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
              transition: all 0.3s;

              &:hover {
                cursor: pointer;
                background-color: #ddd;
                box-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
              }
            }
          }
        }
      }
    }

    .modal-bullet-container {
      .posts {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        padding-bottom: 10px;

        li {
          width: 23%;
          margin: 1%;
          height: 150px;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
          transition: all 0.2s;

          &:hover {
            cursor: pointer;
            scale: 0.98;
            box-shadow: 1px 1px 2px rgb(0 0 0 / 40%);
            filter: brightness(97%);
          }

          img,
          div {
            width: 100%;
            height: 60px;
            object-fit: cover;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
          }

          .posts_desc {
            h4 {
              padding: 0 5px 2px;
              text-overflow: ellipsis;
              font-size: 14px;
              font-weight: 600;
            }

            p {
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 10px;
              padding: 0 5px;
              line-height: 1.4;
            }
          }

          .posts_fb {
            text-align: right;
            padding: 0 10px 3px 0;
            font-size: 10px;
            font-weight: 600;

            span {
              margin-left: 2px;
            }
          }
        }
      }
    }
  }

  .modal-footer {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    padding: 10px 0;

    a,
    button {
      border: none;
      border-radius: 12px;
      box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -1px;
      transition: all 0.3s;

      &:hover {
        cursor: pointer;
        box-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
      }
    }

    a {
      text-decoration: none;
      text-align: center;
      line-height: 56px;
    }

    .forKakao {
      width: 90%;
      margin-right: 2%;
      background-color: #0581bb;
      color: #fff;

      &:hover {
        background-color: #045f8a;
      }
    }

    .scrap {
      width: 8%;
      aspect-ratio: 1 / 1;
      background-color: #fff;
      color: #0581bb;
    }
  }
`;

// delCount, setDelCount 내 북마크 페이지에서 삭제될때마다 재렌더링을 위한 state (자식에서 부모로 전달하기 위해 props로 set까지 전달) - 장윤신
const LocModal = memo(({ isModalOpen, closeModal, data, delCount, setDelCount }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data: data2, loading: loading2, error: error2 } = useSelector((state) => state.ThemeSlice);
  const { data: data3, loading: loading3, error: error3 } = useSelector((state) => state.MapThemeSlice);
  const { data: data4, loading: loading4, error: error4 } = useSelector((state) => state.BookmarkSlice);

  const { data: photos } = useSelector(state => state.PlacePhotoSlice);
  const { data: comments } = useSelector(state => state.PlaceCommentSlice);
  const { data: posts, loading: postsLoading } = useSelector(state => state.PlacePostSlice);

  const [TModal, setTModal] = useState(false);
  const [ThemeData, setThemeData] = useState();
  const [TPList, setTPList] = useState({});
  const [themeList, setThemeList] = useState([]);
  const [BookmarkId, setBookmarkId] = useState();
  const [BookmarkBtn, setBookmarkBtn] = useState(false);

  const onThemeModalOpen = useCallback((e) => {
    setTModal(true);
    console.log("테마추가 모달 오픈");
  });

  useEffect(() => {
    // 테마 데이터
    dispatch(getThemeData()).then((e) => {
      setThemeData(e.payload);
    });

    // theme_place 데이터
    dispatch(getTP()).then((e) => {
      let obj = {};
      Array.from(e.payload)?.forEach((v, i) => {
        obj[v.place_id] ? obj[v.place_id].push(v.theme_id) : (obj[v.place_id] = [v.theme_id]);
      });
      // console.log(obj);

      setTPList(obj);
    });

    // 후기 댓글 데이터
    dispatch(getComment({ place_id: data.id }));
    // 관련된 게시물 데이터
    dispatch(getPost({ place_id: data.id }));
    // 게시물 사진 데이터
    dispatch(getPlacePhotos({ placeId: data.id }));
    
    return () => {
      console.log("모달창 닫음");
    };
  }, []);

  useEffect(() => {
    console.log(photos);
  }, [photos])

  useEffect(() => {
    if (data4) {
      // console.log(data4[0]?.id);
      setBookmarkId(data4[0]?.id);
      if (data4[0]?.id) {
        setBookmarkBtn(true);
      }
    }
  }, [data4]);

  /** 북마크 useEffect - 장윤신 */
  useEffect(() => {
    if (isModalOpen) {
      setBookmarkBtn(false);
    }

    let userInfo = cookieHelper.getCookie('loginInfo');
    if (userInfo) userInfo = JSON.parse(userInfo);
    let user_id = 0;
    if (userInfo?.id) user_id = userInfo.id;

    // bookmark 여부 데이터
    dispatch(getBookmarkItem({ user_id: user_id, place_id: data.id })).then((e) => {
      // console.log(e.payload);
      if (e.payload.length !== 0) {
        setBookmarkId(e.payload[0]?.id);
        setBookmarkBtn(true);
      }
    });

    if (!isModalOpen) {
      console.log("BookmarkId: " + BookmarkId);
      console.log("BookmarkBtn: " + BookmarkBtn);

      if (!BookmarkId && BookmarkBtn) {
        console.log("북마크 등록");
        dispatch(postBookmark({ user_id: user_id, place_id: data.id }));
      }

      if (BookmarkId && !BookmarkBtn) {
        console.log("북마크 삭제");
        dispatch(delBookmark({ index: BookmarkId }));
        setBookmarkId(null);

        // 북마크 페이지에서만 삭제시 재 렌더링을 위한 dependency (북마크 페이지에서만 delCount를 props로 전달)
        if (delCount) {
          setDelCount(delCount + 1);
        }
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (data && data2 && data3) {
      let arr = [];
      if (ThemeData) {
        TPList[data.id]?.forEach((v2, i2) => {
          arr.push(ThemeData[v2]);
        });
      }
      // console.log(arr);
      setThemeList(arr);

      let obj = {};
      Array.from(data3)?.forEach((v, i) => {
        obj[v.place_id] ? obj[v.place_id].push(v.theme_id) : (obj[v.place_id] = [v.theme_id]);
      });
      // console.log(obj);

      setTPList(obj);
    }
  }, [data, data2, data3, TModal]);

  const onAddPhotoClick = useCallback(e => {
    let userInfo = cookieHelper.getCookie('loginInfo');
    if (!userInfo) {
      if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login/repl');
      } else {
        e.preventDefault();
        return;
      }
    } else {
      userInfo = JSON.parse(userInfo);
    }
  }, []);

  const onPlaceImageInputChange = useCallback(async e => {
    const files = Array.from(e.currentTarget.files);
    console.log(files);
    let userInfo = cookieHelper.getCookie('loginInfo');
    if (!userInfo) return;
    else userInfo = JSON.parse(userInfo);

    dispatch(addPlacePhotos({
      userId: userInfo.id,
      username: userInfo.username,
      placeId: data.id,
      files: files
    }));
  }, []);

  const onCommentRadioChange = useCallback((e) => {
    e.preventDefault();
    const current = e.currentTarget;

    current.children[0].checked = true;
    const targetArray = document.querySelectorAll("input[type=radio]");
    targetArray.forEach((v) => {
      if (v.checked === true) {
        v.closest("label").classList.add("active");
      } else {
        v.closest("label").classList.remove("active");
      }
    });

    document.querySelector(".comment__contents").style.maxHeight = "200px";
  }, []);

  const [commentContents, setCommentContents] = useState("");

  const onCommentContentsChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      setCommentContents((state) => value);
      if (commentContents !== "") {
        document.querySelector(".comment__submit-button").classList.add("active");
      } else {
        document.querySelector(".comment__submit-button").classList.remove("active");
      }
    },
    [commentContents]
  );

  const onCommentSubmit = useCallback((e) => {
    e.preventDefault();

    const target = e.currentTarget;

    const rating = target.commentEmoji.value;
    const content = target.comment__input.value;

    console.log(rating, content);

    let userInfo = cookieHelper.getCookie('loginInfo');
    if (userInfo) userInfo = JSON.parse(userInfo);
    let user_id = 0;
    if (userInfo?.id) user_id = userInfo.id;

    dispatch(addComment({
      user_id: user_id,
      place_id: data.id,
      rating: rating,
      content: content
    }));
  }, []);

  /** 북마크 클릭 이벤트 - 장윤신 */
  const onPostBookmarkClick = useCallback((e) => {
    setBookmarkBtn(true);
  });

  const ondelBookmarkClick = useCallback((e) => {
    console.log(BookmarkId);
    setBookmarkBtn(false);
  });

  // 게시물 클릭 이벤트
  const onPostClick = useCallback(e => {
    e.preventDefault();
    navigate(`/bulletin/${e.currentTarget.dataset.id}`);
    closeModal();
  }, []);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(50, 50, 50, 0.75)",
          zIndex: 99999,
        },
        content: {
          backgroundColor: "#F8F8F8",
          width: "700px",
          maxHeight: "1000px",
          height: "800px",
          left: "300px",
          borderRadius: "15px",
          padding: "40px 40px 50px",
          margin: "auto",
          overflowY: "hidden",
          overscrollBehavior: "contain",
        },
      }}>
      <LocModalContainer>
        <div className="modal-header">
          <h3>{data?.place_name}</h3>
          <span>{data?.road_address_name ? data?.road_address_name : data?.address_name}</span>
          <FontAwesomeIcon className="faX" icon={faX} onClick={closeModal} />
        </div>
        <div className="modal-body">
          {/* 이미지 칸 */}
          {
            photos && photos[0]?.filename ? (
              <div className="place-photos">
                <label htmlFor="customPhoto" className="place-photos__add-button" onClick={onAddPhotoClick}>
                  <div className="icon">
                    <img src={iconPlus} alt="plusIcon" />
                    <p>사진 추가하기</p>
                  </div>
                </label>
                <input
                  type='file'
                  accept='.jpg,.PNG'
                  name='customPhoto'
                  id='customPhoto'
                  style={{display: 'none'}}
                  onChange={onPlaceImageInputChange}
                  multiple
                />
                <div className="place-photos__list">
                  {
                    photos.map((v, i) => {
                      return (
                        <img
                          key={i}
                          src={
                            `/thumbnail/thumb_${v.filename.split('.')[0]}_480w.${v.filename.split('.')[1]}`
                          }
                          alt="장소 이미지"
                        />
                      )
                    })
                  }
                </div>
              </div>
            ) : (
              <>
                <label className="modal-img-container" htmlFor='customPhoto' onClick={onAddPhotoClick}>
                  <div className="icon">
                    <img src={iconPlus} alt="plusIcon" />
                  </div>
                  <div className="text">
                    여기를 눌러서 장소와 관련된 사진을 올려주시면
                    <br />
                    페이지가 더 유익해 질 것 같아요!
                  </div>
                </label>
                <input
                  type='file'
                  accept='.jpg,.PNG'
                  name='customPhoto'
                  id='customPhoto'
                  style={{display: 'none'}}
                  onChange={onPlaceImageInputChange}
                  multiple
                />
              </>
            )
          }

          <div className="modal-info-container">
            {/* 왼쪽 줄 */}
            <div className="info">
              <div className="title">여기는 어떤 곳인가요?</div>
              <div className="info-item">
                {
                  themeList && 
                  themeList?.map((v, i) => {
                  return (
                    <div key={i} className="theme-card theme-card__about">
                      {v?.icon + " " + v?.text}
                    </div>
                  );
                })}
                <div className="theme-card center" onClick={onThemeModalOpen}>
                  ➕
                </div>
              </div>
            </div>

            {/* 오른쪽 줄 */}
            <div className="info">
              <div className="info-item">
                <div className="title">이 장소에 대한 후기들!</div>
                {/* 예시 리뷰 //// */}
                {/*
                <div className="review_item">
                  <div className="review_emoji">
                    <img src={emoji[3]} alt="평점 이모지" />
                  </div>
                  <span className="review_text">잔치국수와 김밥의 조화. 준수함.</span>
                </div>
                */}
                {/* //// 예시 리뷰 */}
                {
                  comments && comments.map((v, i) => {
                    return (
                      <div className="review_item" key={i}>
                        <div className="review_emoji">
                          <img src={emoji[v.rating - 1]} alt="평점 이모지" />
                        </div>
                        <span className="review_text">
                          {
                            v.content ? v.content : (
                              v.comment ? v.comment : '내용없음'
                            )
                          }
                        </span>
                      </div>
                    );
                  })
                }
                {data?.review?.map((v, i) => {
                  return (
                    <div key={i} className="theme-card">
                      {v}
                    </div>
                  );
                })}
              </div>
              <div className="info-item">
                <div className="title">직접 의견을 남겨보세요!</div>
                <form className="comment" onSubmit={onCommentSubmit}>
                  <div className="comment__emojies">
                    {emoji.map((v, i) => {
                      return (
                        <label key={i} htmlFor={`commentEmoji${i}`} onClick={onCommentRadioChange}>
                          <input type="radio" name="commentEmoji" id={`commentEmoji${i}`} value={i + 1} />
                          <img src={v} alt='평점 이모지' />
                        </label>
                      );
                    })}
                  </div>
                  <div className="comment__desc">
                    <span>ㅠㅠ</span>
                    <span>...?</span>
                    <span>괜찮아요</span>
                    <span>좋았어요!</span>
                    <span>완벽해요!!</span>
                  </div>
                  <div className="comment__contents">
                    <textarea name="comment__input" className="comment__input" placeholder="여기에 의견을 입력해주세요" rows="5" onChange={onCommentContentsChange}></textarea>
                  </div>
                  <button type="submit" className="comment__submit-button">
                    저장하기
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-bullet-container">
            <div className="title">이 장소를 추천한 게시글 목록</div>
            <ul className="posts">
              {
                <>
                  <Spinner loading={postsLoading} />

                  {
                    posts && posts.map((v, i) => {
                      return (
                        <li key={i} data-id={v.id} onClick={onPostClick}>
                          {
                            v.bgimage ?
                              <img
                                src={
                                  `/thumbnail/thumb_${v.bgimage.split('.')[0]}_480w.${v.bgimage.split('.')[1]}`
                                }
                                alt="미리보기 이미지"
                              />
                              : v.backgroundImage ?
                                <img
                                  src={
                                    `/thumbnail/thumb_${v.backgroundImage.split('.')[0]}_480w.${v.backgroundImage.split('.')[1]}`
                                  }
                                  alt="미리보기 이미지"
                                />
                                : v.bgcolor ?
                                  <div style={{backgrondColor: v.bgcolor}} />
                                   : v.bgColor ?
                                    <div style={{backgrondColor: v.bgColor}} />
                                    : <div>미리보기 없음</div>
                          }
                          <div className="posts_desc">
                            <h4>
                              {
                                v.postTitle ? v.postTitle : (
                                  v.title? v.title : '제목없음'
                                )
                              }
                            </h4>
                            <p dangerouslySetInnerHTML={{ __html: v.content }} />
                          </div>
                          <div className="posts_fb">
                            <p>
                              ♡<span>{v.like}</span>
                            </p>
                          </div>
                        </li>
                      );
                    })
                  }
                </>
              }
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <a href={data.place_url} target="_blank" className="forKakao">
            카카오맵으로 자세히 보기
          </a>
          {/* faBookmark : 북마크 눌렀을때 , faBookmark2: 북마크 누르지 않았을 때 (속이 빈 아이콘) */}
          {BookmarkBtn ? (
            <button className="scrap" onClick={ondelBookmarkClick}>
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          ) : (
            <button className="scrap" onClick={onPostBookmarkClick}>
              <FontAwesomeIcon icon={faBookmark2} />
            </button>
          )}
        </div>
      </LocModalContainer>

      {/* 테마 선택 모달창 */}
      <ThemeModal2 modalIsOpen={TModal} onRequestClose={() => setTModal(false)} onClick={() => setTModal(false)} placeId={data?.id} setTModal={setTModal} themeList={themeList} />
    </Modal>
  );
});

LocModal.defaultProps = {
  title: "장소이름 ???",
  address: "위치 ???",
};

export default LocModal;
