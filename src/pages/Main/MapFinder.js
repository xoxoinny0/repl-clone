import React, { memo, useCallback } from "react";
import { useQueryString } from "../../hooks/useQueryString";
import styled from "styled-components";

import MapFinderTitle from "../../components/Main/MapFinderTitle";
import CreateMap from "../../components/Main/CreateMap";
import ViewMap from "../../components/Main/ViewMap";
import AllList from "../../components/Main/AllList";
import ThemeList from "../../components/Main/ThemeList";
import FollowingList from "../../components/Main/FollowingList";

import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../../slices/SidebarSlice";

const MapFinderContaier = styled.div`
  background: linear-gradient(180deg, #0584bb 35%, #046795 100%);
  /* height: 100vh; */
  height: 100%;

  /* overflow-x:hidden; overflow-y:scroll; */



  .shadow {
    &.active {
      position: fixed;
      z-index: 990;
      width: 100%;
      height: 100%;
      /* background-color: rgba(0, 0, 0, 0.4); */
    }
  }
`;

const MapFinder = memo(() => {
  /** QueryStirng 변수 받기 */
  const { keyword } = useQueryString();
  // console.log(keyword);

  const { filter } = useSelector((state) => state.MainSlice);
  const { isActive } = useSelector((state) => state.SidebarSlice);

  const dispatch = useDispatch();

  // console.log(filter);

  const handleClose = useCallback((e) => {
    if (isActive) {
      dispatch(setActive(false));
    }
  });

  return (
    <MapFinderContaier>
      <div
        className={`shadow ${isActive ? "active" : ""}`}
        onClick={handleClose}
      ></div>

      <MapFinderTitle />
      {filter == 0 && <AllList />}
      {/* {filter == 1 && <ThemeList />} */}
      {/* {filter == 2 && <FollowingList />} */}
      {/* {filter == 0 && <CreateMap />} */}
      {/* {filter == 1 && <ViewMap />} */}
      {/* {filter == 2 && <ViewMap />} */}
    </MapFinderContaier>
  );
});

export default MapFinder;
