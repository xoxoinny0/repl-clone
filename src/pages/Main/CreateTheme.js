import React, { memo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import RegexHelper from "../../helper/RegexHelper";

import Spinner from "../../components/Spinner";

import { useSelector, useDispatch } from "react-redux";
import { postItem } from "../../slices/ThemeSlice";


const CreateThemeContainer = styled.div`
  /* height: 100vw; */
  background: linear-gradient(180deg, #0584bb 35%, #046795 100%);
  color: #fefefe;
  padding: 100px 0 150px;
  .title {
    h1 {
      padding-top: 13px;
      font-size: 35px;
      font-weight: bolder;
      text-align: center;
    }
    .page-desc {
      margin: 50px auto;
      font-size: 14px;
      border: 1px solid #fefefe82;
      padding: 15px;
      box-sizing: border-box;
      max-width: 360px;
      border-radius: 12px;
      span {
        white-space: nowrap;
        a {
          color: #fefefe;
        }
      }
    }
  }

  .form-box {
    padding-top: 30px;
    width: 100%;
    form {
      max-width: 360px;
      margin: auto;
      text-align: left;

      .text-align-right {
        text-align: right;
        margin-top: -30px;
        a {
          text-decoration: none;
          color: #fefefe;
          font-size: 14px;
        }
      }

      hr {
        margin: 50px 0;
        border: 0;
        border-top: 1px solid #f8f8f8;
      }

      .form-submit {
        button {
          cursor: pointer;
          background-color: #da4c1f;
          color: #fefefe;
          transition: all 0.2s;
          box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
          border-radius: 12px;
          padding: 0 40px;
          line-height: 55px;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
          border: none;
          font-size: 15px;
          &:hover {
            background-color: #c4441c;
          }
        }
      }

      .margin {
        margin: 50px auto;
        h2 {
          font-size: 16px;
          margin-bottom: 15px;
        }
        input {
          width: 360px;
          height: 64px;
          border: none;
          outline: none;
          border-radius: 12px;
          padding-left: 20px;
          box-sizing: border-box;
          color: #0581bb;
        }
        .help {
          margin: 14px 0 50px;
          font-size: 14px;
          dt {
            margin-bottom: 5px;
            padding-top: 12px;
            display: flex;
            .emoji {
              font-size: 18px;
            }
          }
          span {
            font-weight: bold;
          }

          .emoji {
            margin-right: 4px;
          }
          dd {
            opacity: 0.8;
            padding-left: 1.8em;
            margin: 15px 0;
          }
        }

        .check {
          display: flex;
          flex-wrap: wrap;
          label {
            padding-left: 15px;
            box-sizing: border-box;
            input {
              width: 16px;
              height: 16px;
              margin: 0 5px 8px 0;
              outline: none;
              border: none;
              cursor: pointer;
            }
          }
        }

        .card {
          /* margin-left: auto; */
          /* margin-right: auto; */
          margin: 20px 0;
          width: 100%;
          max-width: 357px;
          height: 152px;
          padding: 30px;
          box-sizing: border-box;
          background-color: #f8f8f8;
          text-align: center;
          font-size: 15px;
          border-radius: 12px;
          transition: all 0.2s;
          box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
          .icon {
            font-size: 30px;
            margin-bottom: 20px;
          }
          .sentence {
            font-size: 15px;
            line-height: 18px;
            color: #131017;
          }
          .curators {
            font-size: 12px;
            line-height: 14px;
            margin-top: 10px;
            color: #bbbbbb;
          }
        }
      }
    }
  }
`;

const CreateTheme = memo(() => {
  const navigate = useNavigate();


  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.ThemeSlice);

  const myIcon = useRef();
  const mySentence = useRef();

  const onIconPress = useCallback((e) => {
    myIcon.current.innerHTML = e.target.value;
  }, []);

  const onSentencePress = useCallback((e) => {
    mySentence.current.innerHTML = e.target.value;
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.currentTarget;
    console.log(current);
    console.log(current.text)

    // 입력값 유효성검사
    const regexHelper = RegexHelper.getInstance();

    try {
      regexHelper.value(
        document.querySelector(".theme"),
        "테마명을 입력하세요."
      );
      regexHelper.value(
        document.querySelector(".icon"),
        "아이콘을 입력하세요."
      );
    } catch (e) {
      alert(e.message);
      return;
    }

    // 리덕스를 통한 데이터 저장 요청
    dispatch(
      postItem({
        text: current.text.value,
        icon: current.icon.value,
      })
    ).then((result) => {
      console.log(result);

      navigate(`/map?theme=${result.payload.id}`);
    });
  }, []);

  return (
    <CreateThemeContainer>
      <div className="title">
        <h1>테마지도 만들기</h1>
        <div className="page-desc">
          <span>
            큐레이션 지도는 <NavLink to="/mypage">'나의 지도관리'</NavLink>에서
            만들 수 있습니다.
          </span>
        </div>
      </div>

      <div className="form-box">
        <form onSubmit={onSubmit}>
          <div className="margin">
            <h2>테마명</h2>
            <input
              onChange={onSentencePress}
              type="text"
              placeholder="ex) 간단하게 혼밥하기 좋은 곳"
              maxLength={15}
              className="theme"
              name="text"
            ></input>
            <div className="help">
              <dl>
                <dt>
                  <span className="emoji">🙆</span>
                  <span>
                    구체적인 특징이나 상황이 들어간 테마명을 추천합니다.
                  </span>
                </dt>
                <dd>- 예: 2~3명이 술 마시며 이야기하기 좋은 곳</dd>
                <dd>- 예: 하루종일 있어도 눈치 보이지 않는 카페</dd>
                <dt>
                  <span className="emoji">🙅</span>
                  <span>다음의 경우 테마가 임의 삭제될 수 있습니다.</span>
                </dt>
                <dd>- 너무 간단한 이름 (예: 맛집, 이쁜카페)</dd>
                <dd>- 다른 사람들이 이해하기 어려운 이름</dd>
                <dd>
                  - 큐레이션의 특징이 생기기 어려운 이름
                  <br />
                  (예: 술이술술 넘어가는 이자카야)
                </dd>
                <dt>
                  <span className="emoji">💁</span>
                  <span>다음의 경우 테마가 임의 수정될 수 있습니다.</span>
                </dt>
                <dd>- 중복 된 테마</dd>
                <dd>- 오탈자 혹은 불필요한 특수 문자가 있는 테마</dd>
              </dl>
            </div>
          </div>

          <div className="margin">
            <h2>아이콘</h2>
            <input
              type="text"
              placeholder="ex) 🍛"
              maxLength={15}
              onChange={onIconPress}
              className="icon"
              name="icon"
            ></input>
          </div>
          <div className="text-align-right">
            <a
              href="https://www.emojiengine.com/ko/"
              rel="noreferrer"
              target="_blank"
            >
              [ 이모지 키보드바로가기 ]
            </a>
          </div>

          <div className="margin">
            <h2>카테고리</h2>
            <div className="check">
              <label>
                <input type="checkbox" value="food" />
                food
              </label>
              <label>
                <input type="checkbox" value="cafe" />
                cafe
              </label>
              <label>
                <input type="checkbox" value="bar" />
                bar
              </label>
              <label>
                <input type="checkbox" value="store" />
                store
              </label>
              <label>
                <input type="checkbox" value="work" />
                work
              </label>
              <label>
                <input type="checkbox" value="life" />
                life
              </label>
              <label>
                <input type="checkbox" value="pet" />
                pet
              </label>
              <label>
                <input type="checkbox" value="culture" />
                culture
              </label>
            </div>
          </div>

          <div className="margin">
            <h2>검색용 키워드(선택)</h2>
            <input
              type="text"
              placeholder="ex) 음식점, 테이크아웃, 음식, 식당, 패스트푸드"
              maxLength={15}
            ></input>
            <div className="help">
              <dl>
                <dt>
                  <span className="emoji">🧚</span>
                  <span>
                    테마명에는 포함하지 못한 검색용 키워드를 추가할 수 있습니다.
                  </span>
                </dt>
                <dd>- 키워드는 콤마(,)로 구분해주세요.</dd>
              </dl>
            </div>
          </div>

          <hr />

          <div className="margin">
            <span className="label">미리보기</span>
            <div className="card">
              <div className="icon" ref={myIcon}>
                💑
              </div>
              <div className="sentence" ref={mySentence}>
                소개팅 하는 날, 점심식사 하기 좋은 음식점
              </div>
              <div className="curators">6명의 큐레이터</div>
            </div>
          </div>

          <div className="form-submit">
            <button type="submit">
              생성하기
            </button>
          </div>
        </form>
      </div>
    </CreateThemeContainer>
  );
});

export default CreateTheme;
