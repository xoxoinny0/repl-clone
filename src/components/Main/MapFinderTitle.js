import React, { memo, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../../slices/MainSlice";
import { setActive } from "../../slices/SidebarSlice";
import Sidebar from "./Sidebar";

import img from "../../assets/img/main/magnifyingglass2.png";
import { setKeyword } from "../../slices/MapFinderSlice";

const TitleContainer = styled.div`
  height: 100%;
  width: 60%;
  margin: auto;
  padding-top: 150px;


  .title {
    margin-bottom: 60px;
    .icon {
      font-size: 37px;
      text-align: left;
      margin-bottom: 10px;
    }
    a {
      font-size: 30px;
      font-weight: 600;
      color: #fefefe;
      text-align: left;
      margin-top: 20px;
      text-decoration: none;
    }
  }

  .theme_search {
    div {
      cursor: pointer;
      display: flex;
      align-items: center;
      img {
        width: 40px;
      }
      h2 {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .filter {
    margin: 20px 0;
    ul {
      display: flex;
      li {
        margin-bottom: 15px;
        button {
          margin-right: 10px;
          padding: 10px;
          font-size: 13px;
          border-radius: 8px;
          cursor: pointer;
          background-color: #f3f5f7;
          border: none;
          &:hover {
            background-color: #eee;
          }
        }

        .active {
          color: #fefefe;
          background-color: #da4c1f;
        }

        a {
          text-decoration: none;
          color: #444444;
        }
      }
    }
  }
`;

const MapFinderTitle = memo(() => {
  const { filter } = useSelector((state) => state.MainSlice);
  const { isActive } = useSelector((state) => state.SidebarSlice);
  const { keyword } = useSelector((state) => state.MapFinderSlice);

  const dispatch = useDispatch();

  const all = useRef();
  const theme = useRef();
  const following = useRef();
  
  const container = useRef();

  useEffect(() => {
    switch (filter) {
      case 0:
        onAllClick();
        break;
      case 1:
        onThemeClick();
        break;
      default:
        onFollowingClick();
        break;
    }
  }, [filter]);

  // useEffect(() => {
  //   if(setActive) { container.current.style.overflow-y = "hidden"};
  // })

  const onAllClick = useCallback((e) => {
    dispatch(setFilter(0));
    all.current.classList.add("active");
    // theme.current.classList.remove("active");
    // following.current.classList.remove("active");
  });

  const onThemeClick = useCallback((e) => {
    dispatch(setFilter(1));
    theme.current.classList.add("active");
    all.current.classList.remove("active");
    following.current.classList.remove("active");
  });

  const onFollowingClick = useCallback((e) => {
    dispatch(setFilter(2));
    following.current.classList.add("active");
    all.current.classList.remove("active");
    theme.current.classList.remove("active");
  });

  // 사이드바 이벤트
  const onSearch = useCallback(() => {
    dispatch(setActive(true));
  }, [keyword]);

  // console.log(keyword);
  return (
    <TitleContainer ref={container}>
      <Sidebar />
      <div className="title">
        <div className="icon">🗺</div>
        <NavLink to="/map_finder">지도 찾기</NavLink>
      </div>

      <div className="theme_search">
        <div onClick={onSearch}>
          <img src={img} alt="img" />
          {keyword == "" ? (
            <h2>상황에 맞는 지도를 찾아보세요.</h2>
          ) : (
            <h2>{keyword}</h2>
          )}
        </div>
      </div>

      <div className="filter">
        <ul>
          <li>
            <button type="button" onClick={onAllClick} ref={all}>
              테마지도
            </button>
          </li>
          {/* <li>
            <button type="button" onClick={onThemeClick} ref={theme}>
              🗺테마지도
            </button>
          </li>
          <li>
            <button type="button" onClick={onFollowingClick} ref={following}>
              👫팔로잉지도
            </button>
          </li> */}
        </ul>
      </div>
    </TitleContainer>
  );
});

export default MapFinderTitle;
