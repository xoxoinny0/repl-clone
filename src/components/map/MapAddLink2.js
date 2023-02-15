/**
 * [MAP] 장소 추가하기 버튼 컴포넌트
 */
import React, { memo } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const MapAddLinkContainer = styled.div`
  width: 200px;
  height: 57.5px;
  border-radius: 12px 0 0 12px;
  background-color: #0581bb;
  z-index: 1;
  position: fixed;
  line-height: 37.5px;
  font-weight: bold;
  color: white;
  top: 140px;
  right: 0;
  opacity: 0.8;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  letter-spacing: 2px;
  display: flex;
  font-size: 17px;
  text-decoration: none;

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

const MapAddLink2 = memo(({ onClick }) => {
  return (
    <MapAddLinkContainer onClick={onClick}>
      <span>장소 추가하기</span>
      <FontAwesomeIcon icon={faPen} />
    </MapAddLinkContainer>
  );
});

export default MapAddLink2;
