import React, { memo, useCallback, useRef } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setKeyword } from "../../slices/MapFinderSlice";
import img from "../../assets/img/main/magnifyingglass.png";

const SearchContainer = styled.div`
  text-align: center;
  margin-bottom: 50px;
  form {
    div {
      max-width: 360px;
      margin: auto;
      position: relative;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      input {
        width: 100%;
        background-color: #f8f8f8;
        padding: 3px 20px;
        box-sizing: border-box;
        border: none;
        height: 65px;
        border-radius: 12px;
        box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
        flex: none;
        font-size: 17px;
        &:focus {
        outline: none;
        background-color: #f8f8f8;

        }
      }
      button {
        position: absolute;
        right: 10px;
        top: 0; 
        cursor: pointer;
        border: none;
        font-size: 16px;
        height: 60px;
        background-color: #f8f8f8;


        img {
          height: auto;
          box-sizing: border-box;
          object-fit: cover;
          vertical-align: middle;

        }
      }
    }
  }

  .find_place {
    max-width: 360px;
    height: 65px;
    margin: auto;
    border-radius: 12px;
    background-color: #da4c1f;
    box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
    &:hover {
        background-color: #c4441c;
        transition: all .2s;
      }

    a {
      display: block;
      cursor: pointer;
      width: auto;
      height: 100%;
      text-decoration: none;
      display: flex;
      align-items: center;
      
      span {
        margin: auto;
        color: #fff;
      }
    }
  }
`;

const Search = memo(() => {
  /** 페이지 강제 이동을 처리하기 위한 navigate 함수 생성 */
  const navigate = useNavigate();

  const dispatch = useDispatch();


  /** 지도 찾기 페이지로 이동 이벤트 */
  const onmapSubmit = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;
    const keyword = current.keyword.value;

    let redirectUrl = keyword ? `/map_finder?keyword=${keyword}` : '/map_finder'
    console.log(keyword);
    navigate(redirectUrl);

    dispatch(setKeyword(keyword));

  },[navigate]);

  const { keyword } = useSelector((state) => state.MapFinderSlice);

  return (
    <SearchContainer>
      <form onSubmit={onmapSubmit}>
        <div>
          <input type="text" name='keyword' placeholder="지도를 검색해보세요" />
          <button type='submit'>
            <img src={img} alt="img" />
          </button>
        </div>
      </form>
      <div className="find_place">
        <NavLink to='/map'>
          <span>🧭 지도에서 찾기</span>
        </NavLink>
      </div>
    </SearchContainer>
  );
});

export default Search;
