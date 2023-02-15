/**
 * [MAP] 현재 범위로 찾기 버튼 컴포넌트
 */
import React, { memo } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";

const SearchLocContainer = styled.div`
  width: 200px;
  height: 50px;
  border-radius: 10px;
  background-color: #da4c1f;
  z-index: 1;
  position: fixed;
  line-height: 1.8;
  font-weight: bold;
  color: white;
  bottom: 4vw;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0.8;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  display: flex;
  letter-spacing: 1px;
  font-size: 17px;

  &:hover {
    opacity: 1;
  }

  span {
    width: 80%;
  }

  svg {
    width: 20%;
    margin: 6.5px 0;
  }
`;

const SearchLoc = memo(({ onClick }) => {
  return (
    <SearchLocContainer onClick={onClick}>
      <span>이 지역 재검색</span>
      <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
    </SearchLocContainer>
  );
});

export default SearchLoc;
