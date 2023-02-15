import React, { memo } from "react";
import styled from "styled-components";

import Slider from "../../components/Main/Slider";
import Search from "../../components/Main/Search";
import PlaceList from "../../components/Main/PlaceList";


const MainContainer = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #0584BB 35%, #046795 100%);
  padding: 15px;
  box-sizing: border-box;

  h2 {
    width: 60%;
    margin: auto;
    color: #FEFEFE;
    font-size: 20px;
    /* margin: 0 140px 10px 140px; */
    margin-bottom: 10px;
    font-weight: 600;
  }
  h3 {
    width: 60%;
    margin: auto;
    color: #FEFEFE;
    font-size: 14px;
    font-weight: 400;
    opacity: .7;
    /* margin: 0 140px 10px 140px; */
  }
`;

const index = memo(() => {
  return (
    <MainContainer>
      <Slider />
      <Search />
      <h2>추천 장소들</h2>
      <h3>리플에서 관심사에 따른 장소들을 추천해드립니다.</h3>
      <PlaceList />
      <h2>요즘 뜨는 장소들</h2>
      <h3>리플에서 사랑받는 장소들을 소개합니다.</h3>
      <PlaceList />
    </MainContainer>
  );
});

export default index;
