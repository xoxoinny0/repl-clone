import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";


const ViewMapContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 30px;
  z-index: 10;

  text-align: center;
  a {
    width: 163px;
    height: 55px;
    line-height: 30px;
    display: inline-block;
    padding: 15px 20px;
    box-sizing: border-box;
    background-color: #0581bb;
    border-radius: 100px;
    text-decoration: none;
    color: #fefefe;
    letter-spacing: -0.5px;
    box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
    &:hover {
      background-color: #0d75a9;
    }
    .text {
      font-size: 15px;
    }
    .emoji {
      font-size: 15px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
`;

const ViewMap = memo(() => {
  return (
    <ViewMapContainer>
      <NavLink to='/map'>
        <span className="emoji">🗺</span>
        <span className="text">지도에서 보기</span>
      </NavLink>
    </ViewMapContainer>
  );
});

export default ViewMap;
