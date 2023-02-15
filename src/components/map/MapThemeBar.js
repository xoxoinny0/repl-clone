import React, { memo } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "animate.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MapThemeBarContainer = styled.div`
  position: fixed;
  right: 0;
  top: 70px;
  background-color: #fefefe;
  z-index: 1;
  padding: 8px 20px;
  box-sizing: border-box;
  height: 57.5px;
  font-size: 16px;
  line-height: 41.5px;
  border-radius: 12px 0 0 12px;
  box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
  font-weight: 600;
  transition: 2s;

  .arrow {
    margin-right: 10px;
    padding-right: 10px;
    border-right: 3px solid #ccc;
    font-size: 22px;
  }

  span {
    padding-right: 8px;
    margin-right: 8px;
    border-right: 3px solid #ccc;
  }

  .link {
    padding-right: 8px;
    margin-right: 8px;
    border-right: 3px solid #ccc;
  }
  a {
    text-decoration: none;
    color: #0581bb;
  }
`;

const MapThemeBar = memo(({ theme, ThemeData, Add }) => {
  const back = "/map?theme=" + theme;

  return (
    <MapThemeBarContainer className={`${"animate__animated"} ${"animate__fadeInRight"} ${"animate__faster"}`}>
      {Add && (
        <Link className="arrow" to={back}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      )}
      {theme && ThemeData && <span>{ThemeData[theme]?.icon + " " + ThemeData[theme]?.text}</span>}
      <Link className="link" to={"/map_finder"}>
        테마
      </Link>
      <Link to={"/map"}>전체</Link>
    </MapThemeBarContainer>
  );
});

export default MapThemeBar;
