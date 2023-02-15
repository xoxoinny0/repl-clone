import React, { memo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

// 임시데이터
let data = [
  {id: 1,  emoji: "🐶", title: "팔로잉지도1", desc: "팔로잉지도1"},
  {id: 2,  emoji: "🐶", title: "팔로잉지도2", desc: "팔로잉지도2"},
  {id: 3,  emoji: "🐶", title: "팔로잉지도3", desc: "팔로잉지도3"},
  {id: 4,  emoji: "🐶", title: "팔로잉지도4", desc: "팔로잉지도4"},
  {id: 5,  emoji: "🐶", title: "팔로잉지도5", desc: "팔로잉지도5"},
  {id: 6,  emoji: "🐶", title: "팔로잉지도6", desc: "팔로잉지도6"},
  {id: 7,  emoji: "🐶", title: "팔로잉지도7", desc: "팔로잉지도7"},
  {id: 8,  emoji: "🐶", title: "팔로잉지도8", desc: "팔로잉지도8"},
  {id: 9,  emoji: "🐶", title: "팔로잉지도9", desc: "팔로잉지도9"},
];

const ThemeContainer = styled.div`
  margin-bottom: 30px;
  /* padding: 30px;
  box-sizing: border-box; */
  width: 60%;
  margin: auto;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .link {
      display: block;
      text-decoration: none;
      width: 32%;
      /* flex: none; */
      margin-bottom: 30px;
    }
    li {
      background-color: #f8f8f8;
      text-align: center;
      text-decoration: none;
      border-radius: 12px;
      box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
      padding: 30px;
      box-sizing: border-box;
      height: 180px;

      .emoji {
        font-size: 30px;
        margin-bottom: 20px;
      }
      .title {
        font-size: 15px;
        margin-bottom: 20px;
        color: #131017;
      }
      .desc {
        font-size: 12px;
        color : #666;

      }
    }
  }
`;

const FollowingList = memo(() => {
  return (
    <ThemeContainer>
      <ul>
        {/* 추후에 인피니티 스크롤 적용해야함 */}
        {data.map(({ id, emoji, title, desc }, i) => {
          return (
            <NavLink to={`/theme/${id}`} className="link" key={i}>
              <li>
                <div className="emoji">{emoji}</div>
                <div className="title">{title}</div>
                <div className="desc">{desc}</div>
              </li>
            </NavLink>
          );
        })}
      </ul>
    </ThemeContainer>
  );
});

export default FollowingList;
