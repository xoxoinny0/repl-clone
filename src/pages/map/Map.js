/*global kakao*/
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getMapData } from "../../slices/MapSlice";
import { getThemeData } from "../../slices/ThemeSlice";
import { getTP } from "../../slices/MapThemeSlice";

import { MapContainer, ListContainer } from "../../components/map/MapStyled";
import MapThemeBar from "../../components/map/MapThemeBar";
import LocModal from "../../common/LocModal";
import SearchLoc from "../../components/map/SearchLoc";
import MapAddLink from "../../components/map/MapAddLink";
import MapAddLink2 from "../../components/map/MapAddLink2";
import ThemeModal from "../../components/map/ThemeModal";
import Spinner from "../../common/Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

import markerStar from "../../assets/img/map/markerStar.png";
import markerRed from "../../assets/img/map/markerRed.png";
import markerBlue from "../../assets/img/map/markerBlue.png";
import iconMore from "../../assets/img/map/icon-more.svg";

import { useQueryString } from "../../hooks/useQueryString";

import "animate.css";
import CookieHelper from "../../helper/CookieHelper";

const Map = memo(() => {
  const dispatch = useDispatch();
  const { data: data, loading: loading, error: error } = useSelector((state) => state.MapSlice);
  const { data: data2, loading: loading2, error: error2 } = useSelector((state) => state.ThemeSlice);
  const { data: data3, loading: loading3, error: error3 } = useSelector((state) => state.MapThemeSlice);

  const { theme } = useQueryString();
  const [TModal, setTModal] = useState(false);

  const yourLoc = useRef();
  const [yourCoord, setYourCoord] = useState();
  const kakaoRef = useRef();
  const [replMap, setReplMap] = useState();
  const [btnActive, setBtnActive] = useState();

  const [swLimit, setSwLimit] = useState([32, 123]);
  const [neLimit, setNeLimit] = useState([44, 133]);
  // const [centerCoord, setCenterCoord] = useState([37.5025506249856, 127.02485228946493]); // 이젠 아카데미 좌표
  const [centerCoord, setCenterCoord] = useState([36.38, 127.51]); // 남한 중심 좌표
  const [zoomLevel, setZoomLevel] = useState(12);

  const [modalContent, setModalContent] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [LocData, setLocData] = useState();
  const [ThemeData, setThemeData] = useState();
  const [TPList, setTPList] = useState({});

  /**
   * 처음 열릴때 지도를 렌더링하고 전체 데이터를 가져옴 (1회)
   */
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(centerCoord[0], centerCoord[1]),
      level: zoomLevel,
    };
    const map = new kakao.maps.Map(container, options);
    setReplMap(map);
    console.log("🗺️ 지도 렌더링");

    // 장소 데이터
    dispatch(getMapData());
    // 테마 데이터
    dispatch(getThemeData()).then((e) => {
      setThemeData(e.payload);
    });
    // theme_place 데이터
    dispatch(getTP()).then((e) => {
      let obj = {};
      Array.from(e.payload)?.forEach((v, i) => {
        obj[v.place_id] ? obj[v.place_id].push(v.theme_id) : (obj[v.place_id] = [v.theme_id]);
      });
      console.log(obj);

      setTPList(obj);
    });
  }, []);

  /**
   * 기존의 마커를 전부 지우기 위해 지도를 재 렌더링
   * 필터링 조건이 바뀜에 따라 전체 데이터에서 필터링한 새로운 데이터를 넣어줌
   */
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      // 보고 있던 중심좌표와 확대레벨
      center: new kakao.maps.LatLng(centerCoord[0], centerCoord[1]),
      level: zoomLevel,
    };
    const map = new kakao.maps.Map(container, options);
    setReplMap(map);
    console.log("♻️ 지도 재 렌더링");

    if (data && TPList) {
      setLocData((LocData) => {
        const newData = [];

        if (theme) {
          data.forEach((v, i) => {
            // 지도 범위 제한 , 테마 별로 필터링(querystring 존재할 시)
            if (v["lat"] > swLimit[0] && v["lat"] < neLimit[0] && v["lng"] > swLimit[1] && v["lng"] < neLimit[1] && TPList[v.id]?.includes(+theme)) {
              newData.push(v);
            }
          });
        } else {
          data.forEach((v, i) => {
            // 지도 범위 제한
            if (v["lat"] > swLimit[0] && v["lat"] < neLimit[0] && v["lng"] > swLimit[1] && v["lng"] < neLimit[1]) {
              newData.push(v);
            }
          });
        }

        return newData;
      });
    }
  }, [data, centerCoord, theme]);

  /**
   * 데이터가 바뀔때 마다 마커와 목록을 출력
   */
  useEffect(() => {
    // 현재위치를 찾았었다면 마커 표시
    if (yourCoord) {
      displayMarker(yourCoord, "현재 위치");
    }

    if (LocData && LocData.length != 0) {
      setBtnActive(null);
      console.log(LocData);
      console.log("📍 마커 렌더링");
      /**
       * 데이터에 저장된 위치 지도에 마커 출력
       */
      const imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기 입니다
      const overSize = new kakao.maps.Size(29, 42); // 마커 이미지의 이미지 크기 입니다

      const markerImage = new kakao.maps.MarkerImage(markerBlue, imageSize); // 마커 이미지를 생성합니다
      const overImage = new kakao.maps.MarkerImage(markerBlue, overSize); // 확대된 마커 이미지를 생성합니다
      // const overImage = new kakao.maps.MarkerImage(markerStar, overSize); // 확대된 마커 이미지를 생성합니다

      LocData.forEach((v, i) => {
        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
          map: replMap, // 마커를 표시할 지도
          position: new kakao.maps.LatLng(v.lat, v.lng), // 마커를 표시할 위치
          title: v.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });
        marker.setMap(replMap);

        /**
         * 마커에 mouseover, mouseout 이벤트
         */
        var infowindow = new kakao.maps.InfoWindow({
          disableAutoPan: true,
          content: `<div class="info_title" >${v.place_name}</div>`, // 인포윈도우
        });

        const listItem = document.querySelector(".loc" + i);
        /** 마커 마우스오버 이벤트 */
        kakao.maps.event.addListener(marker, "mouseover", function () {
          // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          infowindow.open(replMap, marker);
          // 마커 이미지 약간 확대
          marker.setImage(overImage);
          listItem.classList.add("hover");
        });

        /** 마커 마우스아웃 이벤트 */
        kakao.maps.event.addListener(marker, "mouseout", function () {
          // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          infowindow.close();
          marker.setImage(markerImage);
          listItem.classList.remove("hover");
        });

        /** 마커 마우스클릭 이벤트 */
        kakao.maps.event.addListener(marker, "click", function () {
          infowindow.open(replMap, marker);
          listItem.scrollIntoView({ behavior: "smooth" });
          setBtnActive(i);
        });

        /** 목록에 마우스엔터,리브시 마커에 인포윈도우 출력 이벤트 */
        listItem.addEventListener("mouseenter", (e) => {
          infowindow.open(replMap, marker);
          e.currentTarget.classList.add("hover");
          marker.setImage(overImage);
        });

        listItem.addEventListener("mouseleave", (e) => {
          infowindow.close();
          e.currentTarget.classList.remove("hover");
          marker.setImage(markerImage);
        });

        /** 목록 클릭시 이벤트 */
        listItem.addEventListener("click", (e) => {
          var moveLatLng = new kakao.maps.LatLng(v.lat, v.lng);
          setBtnActive(i);
          replMap.panTo(moveLatLng);
        });

        listItem.classList.add("animate__animated", "animate__flipInX"); // 엘리먼트에 애니메이션 클래스 부여
        // animate__animated클래스를 부여하면 자동으로 등록되는 커스텀 이벤트
        listItem.addEventListener("animationend", () => {
          // 애니메이션 실행이 끝나면 함수 실행
          listItem.classList.remove("animate__animated", "animate__flipInX");
        });
      });
    }
  }, [LocData]);

  /**
   * 현재 범위로 찾기
   */
  const onSearchLoc = useCallback((e) => {
    var center = replMap.getCenter(); // 지도의 현재 중심좌표를 얻어옵니다
    var bounds = replMap.getBounds(); // 지도의 현재 영역을 얻어옵니다
    var swLatLng = bounds.getSouthWest(); // 영역의 남서쪽 좌표를 얻어옵니다
    var neLatLng = bounds.getNorthEast(); // 영역의 북동쪽 좌표를 얻어옵니다
    var level = replMap.getLevel(); // 지도의 확대 수준을 얻어옵니다.

    console.log("현재 영역의 남서쪽 좌표 : " + swLatLng + ", 북동쪽 좌표 : " + neLatLng);

    setZoomLevel(level);
    setSwLimit([swLatLng["Ma"], swLatLng["La"]]);
    setNeLimit([neLatLng["Ma"], neLatLng["La"]]);
    setCenterCoord([center["Ma"], center["La"]]);
  });

  /**
   * 현재 위치 찾기
   */
  const onYourLoc = useCallback((e) => {
    console.log("📍 현재 위치 찾기");

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다

        console.log(locPosition);
        setYourCoord(locPosition);
        // setCenterCoord([locPosition["Ma"]]);
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        replMap.panTo(locPosition);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      var locPosition = new kakao.maps.LatLng(37.5025506249856, 127.02485228946493),
        message = "현재 위치를 찾을 수 없습니다.";

      displayMarker(locPosition, message);
    }
  });

  function displayMarker(locPosition, message) {
    var imageSize = new kakao.maps.Size(35, 35); // 마커 이미지의 이미지 크기 입니다
    var markerImage = new kakao.maps.MarkerImage(markerRed, imageSize); // 마커 이미지를 생성합니다

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      map: replMap,
      position: locPosition,
      image: markerImage, // 마커 이미지
    });

    var iwContent = message, // 인포윈도우에 표시할 내용
      iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable,
      disableAutoPan: true,
    });

    // 인포윈도우를 마커위에 표시합니다
    infowindow.open(replMap, marker);
  }

  /**
   * 모달창 제어
   */
  const onModalIsOpen = useCallback((e) => {
    setModalContent(e.currentTarget.dataset.id);
    setModalIsOpen(true);
    console.log("모달창 열림 id: " + e.currentTarget.dataset.id);
  });

  const onThemeModalOpen = useCallback((e) => {
    setTModal(true);
  });

  useEffect(() => {
    if (data3) {
      let obj = {};
      Array.from(data3)?.forEach((v, i) => {
        obj[v.place_id] ? obj[v.place_id].push(v.theme_id) : (obj[v.place_id] = [v.theme_id]);
      });
      // console.log(obj);

      setTPList(obj);
    }
  }, [data3]);

  return (
    <MapContainer>
      <Spinner loading={loading} />

      {/* 지도 */}
      <div ref={kakaoRef} id="map" style={{ width: "100%", height: "95vh" }}></div>

      {/* 보고있는 테마 */}
      <MapThemeBar theme={theme} ThemeData={ThemeData} Add={false} />

      {/* 내 위치 찾기 버튼 */}
      <FontAwesomeIcon ref={yourLoc} className="yourLoc" icon={faLocationCrosshairs} onClick={onYourLoc} />

      {/* 현재 범위로 찾기 버튼 */}
      <SearchLoc onClick={onSearchLoc} />

      {/* 장소 추가하기 링크 */}
      {theme ? <MapAddLink theme={theme && theme} /> : <MapAddLink2 onClick={onThemeModalOpen} />}

      {/* 테마 선택 모달창 */}
      <ThemeModal modalIsOpen={TModal} onRequestClose={() => setTModal(false)} onClick={() => setTModal(false)} />

      {/* 장소 목록 */}
      <ListContainer id="container">
        {LocData?.map((v, i) => {
          return (
            <div key={i} data-loc={v.latlng} data-title={v.title} className={`${"list_item"} ${"loc" + i} ${i == btnActive ? "active" : ""}  ${"animate__faster"}`} style={{ animationDelay: i * 40 + "ms" }}>
              <h3>{v.place_name}</h3>
              <span className="category">{v.category_item_name}</span>
              <br />
              <span className="address">{v.road_address_name ? v.road_address_name : v.address_name}</span>
              {TPList &&
                ThemeData &&
                TPList[v.id]?.map((v2, i2) => {
                  return (
                    <a key={i2} className="theme">
                      {ThemeData[v2]?.icon + " " + ThemeData[v2]?.text}
                    </a>
                  );
                })}
              <div className="more_btn" onClick={onModalIsOpen} data-id={v.id}>
                <img src={iconMore} />
              </div>
            </div>
          );
        })}

        {/* 검색 데이터 없을 경우 */}
        {LocData?.length == 0 && (
          <div className={`${"list_item"}  ${"animate__faster"}  ${"animate__animated"} ${"animate__flipInX"}`}>
            <div className={`${"no_result"} ${"animate__infinite"} ${"animate__animated"} ${"animate__pulse"} ${"animate__slow"}`}>
              <span>😥</span>
              <br />
              검색 결과가 없습니다.
            </div>
          </div>
        )}
        {/* 장소 정보 모달창 */}
        {LocData?.map((v, i) => {
          let themeList = [];
          if (ThemeData) {
            TPList[v.id]?.forEach((v2, i2) => {
              themeList.push(ThemeData[v2]);
            });
          }

          if (v.id == modalContent) return <LocModal key={i} isModalOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} data={v} />;
        })}
      </ListContainer>
    </MapContainer>
  );
});

export default Map;
