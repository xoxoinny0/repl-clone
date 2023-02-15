/*global kakao*/
import React, { memo, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getMapData } from "../../slices/MapSlice";
import { getThemeData } from "../../slices/ThemeSlice";
import { getUserTP, deleteTP } from "../../slices/MapThemeSlice";
import { getBookmarkList } from "../../slices/BookmarkSlice";

import LocModal from "../../common/LocModal";

import { ListContainer } from "../../components/map/MapStyled";
import iconMore from "../../assets/img/map/icon-more.svg";
import iconTrash from "../../assets/img/map/icon-trash.svg";

import "animate.css";

const CuratorTitle = styled.div`
  background-color: #0581bb;
  height: 57px;
  padding: 0 20px;
  line-height: 57px;
  position: fixed;
  right: 0;
  top: 100px;
  box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
  letter-spacing: -0.5px;
  font-weight: 400;
  font-size: 17px;
  color: #131017;
  z-index: 1;
  border-radius: 12px 0 0 12px;
  color: #fefefe;
`;

const LocTitle = styled.div`
  width: 180px;
  font-weight: 600;
  background-color: #0581bb;
  border-radius: 8px;
  height: 35px;
  color: #fefefe;
  line-height: 31px;
  padding: 2px 14px;
  margin: 10px;
  margin-bottom: 20px;
`;

const MapBookmark = memo(() => {
  const dispatch = useDispatch();
  const { data: data, loading: loading, error: error } = useSelector((state) => state.MapSlice);
  const { data: data4, loading: loading4, error: error4 } = useSelector((state) => state.BookmarkSlice);

  const { id } = useParams(); // user_id
  const [map, setMap] = useState();

  const [btnActive, setBtnActive] = useState();
  const [LocData, setLocData] = useState();

  const [modalContent, setModalContent] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [delCount, setDelCount] = useState(1); // 데이터가 삭제될 경우 재 렌더링 되기위한 디펜던시

  const [BookmarkPlace, setBookmarkPlace] = useState([]);

  const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

  /**
   * 처음 열릴때 지도를 렌더링하고 전체 데이터를 가져옴 (1회)
   */
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      // 이젠 아카데미 위도 경도
      center: new kakao.maps.LatLng(37.5025506249856, 127.02485228946493),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    setMap(map);
    console.log("🗺️ 지도 렌더링");

    // 리플에 등록된 장소데이터를 가져옵니다 (중복인지 확인 위함)
    dispatch(getMapData()).then((e) => {
      console.log(e);
      console.log(data);
      setLocData(e.payload);
    });

    dispatch(getBookmarkList({ user_id: 2 })).then((e) => {
      console.log(e.payload);
      let arr = [];
      e.payload.forEach((v, i) => {
        arr.push(v.place_id);
      });

      console.log(arr);
      setBookmarkPlace(arr);
    });
  }, [delCount]);

  /**
   * 모달창 제어
   */
  const onModalIsOpen = useCallback((e) => {
    setModalContent(e.currentTarget.dataset.id);
    setModalIsOpen(true);
    console.log("모달창 열림 id: " + e.currentTarget.dataset.id);
  });

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "95vh", position: "relative" }}></div>

      <CuratorTitle>{id}님</CuratorTitle>
      <ListContainer>
        <LocTitle>❤️ 내가 좋아하는 장소들</LocTitle>

        {LocData?.map((v, i) => {
          if (BookmarkPlace?.includes(v.id)) {
            return (
              <div key={i} data-loc={v.latlng} data-title={v.title} className={`${"list_item"} ${"loc" + i} ${i == btnActive ? "active" : ""}  ${"animate__faster"} ${"animate__animated"} ${"animate__flipInX"}`} style={{ animationDelay: i * 40 + "ms" }}>
                <h3>{v.place_name}</h3>
                <span className="category">{v.category_item_name}</span>
                <br />
                <span className="address">{v.road_address_name ? v.road_address_name : v.address_name}</span>

                <div className="more_btn" onClick={onModalIsOpen} data-id={v.id}>
                  <img src={iconMore} />
                </div>
              </div>
            );
          }
        })}
      </ListContainer>

      {/* 장소 정보 모달창 */}
      {data?.map((v, i) => {
        if (v.id == modalContent) return <LocModal key={i} isModalOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} data={v} delCount={delCount} setDelCount={setDelCount} />;
      })}
    </div>
  );
});

export default MapBookmark;
