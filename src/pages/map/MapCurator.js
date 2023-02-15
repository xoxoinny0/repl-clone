/*global kakao*/
import React, { memo, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getMapData } from "../../slices/MapSlice";
import { getThemeData } from "../../slices/ThemeSlice";
import { getUserTP, deleteTP } from "../../slices/MapThemeSlice";

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

const MapCurator = memo(() => {
  const dispatch = useDispatch();
  const { data: data, loading: loading, error: error } = useSelector((state) => state.MapSlice);
  const { data: data2, loading: loading2, error: error2 } = useSelector((state) => state.ThemeSlice);
  const { data: data3, loading: loading3, error: error3 } = useSelector((state) => state.MapThemeSlice);

  const { id } = useParams(); // user_id
  const [map, setMap] = useState();

  const [ThemeData, setThemeData] = useState();
  const [TPList, setTPList] = useState({});

  const [btnActive, setBtnActive] = useState();
  const [LocData, setLocData] = useState();

  const [modalContent, setModalContent] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [delCount, setDelCount] = useState(0); // 데이터가 삭제될 경우 재 렌더링 되기위한 디펜던시

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

    // 테마 데이터
    dispatch(getThemeData()).then((e) => {
      setThemeData(e.payload);
    });

    // theme_place 데이터
    dispatch(getUserTP({ user_id: id })).then((e) => {
      let obj = {};
      Array.from(e.payload)?.forEach((v, i) => {
        obj[v.place_id] ? obj[v.place_id].push(v.theme_id) : (obj[v.place_id] = [v.theme_id]);
      });
      setTPList(obj);
    });

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1, disableAutoPan: true });
  }, [delCount]);

  /**
   * 장소 지우기
   */
  const onTrashClick = useCallback(async (e) => {
    const place_id = e.currentTarget.dataset.id;
    const theme_id = e.currentTarget.dataset.theme_id;
    console.log("place_id: " + place_id + ", theme_id: " + theme_id);

    let index = null;
    data3?.forEach((v, i) => {
      if (v.place_id == place_id && v.theme_id == theme_id) {
        console.log(v);
        index = v.id;
      }
    });

    const place_name = e.currentTarget.dataset.name;

    if (
      window.confirm(`[${data2[theme_id].icon}${data2[theme_id].text}] 테마에 저장한
[${place_name}] 장소를 삭제하시겠습니까?
작성하신 의견은 장소 상세페이지에서 삭제해야 합니다.`)
    ) {
      console.log("삭제 진행" + "place_id: " + place_id + ", theme_id: " + theme_id);
      // document.querySelector(".loc" + e.currentTarget.dataset.element).classList.add("animate__flipOutX");

      try {
        // await wait(500);
        await dispatch(deleteTP({ index: index }));
        await setDelCount(delCount + 1);
      } catch (err) {
        console.error(err);
      }
    }
  });

  /**
   * 모달창 제어
   */
  const onModalIsOpen = useCallback((e) => {
    setModalContent(e.currentTarget.dataset.id);
    setModalIsOpen(true);
    console.log("모달창 열림 id: " + e.currentTarget.dataset.id);
  });

  // 문자 배열을 숫자 배열로 바꾸는 함수
  const toNumbers = (arr) => arr.map(Number);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "95vh", position: "relative" }}></div>

      <CuratorTitle>{id}님의 지도</CuratorTitle>
      <ListContainer>
        <LocTitle>테마지도에 추천한 장소들</LocTitle>
        {/* <LocTitle>큐레이션 지도</LocTitle> */}

        {TPList &&
          LocData?.map((v, i) => {
            if (toNumbers(Object.keys(TPList)).includes(v.id)) {
              return (
                <div key={i}>
                  {TPList[v.id]?.map((v2, i2) => {
                    return (
                      <div key={i2} data-loc={v.latlng} data-title={v.title} className={`${"list_item"} ${"loc" + i} ${i == btnActive ? "active" : ""}  ${"animate__faster"} ${"animate__animated"} ${"animate__flipInX"}`} style={{ animationDelay: i * 40 + "ms" }}>
                        <h3>{v.place_name}</h3>
                        <span className="category">{v.category_item_name}</span>
                        <br />
                        <span className="address">{v.road_address_name ? v.road_address_name : v.address_name}</span>

                        <a className="theme">{ThemeData && ThemeData[v2]?.icon + " " + ThemeData[v2]?.text}</a>

                        {/* 로그인 회원정보와 url의 id가 동일할 경우에 지우기 버튼 활성화 */}
                        <div className="trash_btn" onClick={onTrashClick} data-name={v.place_name} data-id={v.id} data-theme_id={v2} data-element={i}>
                          <img src={iconTrash} />
                        </div>
                        <div className="more_btn" onClick={onModalIsOpen} data-id={v.id}>
                          <img src={iconMore} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
      </ListContainer>

      {/* 장소 정보 모달창 */}
      {data?.map((v, i) => {
        let themeList = [];
        if (ThemeData) {
          TPList[v.id]?.forEach((v2, i2) => {
            themeList.push(ThemeData[v2]);
          });
        }

        if (v.id == modalContent) return <LocModal key={i} isModalOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} data={v} />;
      })}
    </div>
  );
});

export default MapCurator;
