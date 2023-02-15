/*global kakao*/
import React, { memo, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQueryString } from "../../hooks/useQueryString";
// 슬라이스
import { getMapData } from "../../slices/MapSlice";
import { getThemeData } from "../../slices/ThemeSlice";
import { modalOpen1 } from "../../slices/MapAddSlice";
// 컴포넌트
import MapThemeBar from "../../components/map/MapThemeBar";
import MapAddModal1 from "../../components/map/MapAddModal1";
import MapAddModal2 from "../../components/map/MapAddModal2";
import MapAddModal3 from "../../components/map/MapAddModal3";
import { MapAddListContainer } from "../../components/map/MapAddList";
// css
import "../../assets/css/MapAddModal.css";
import "animate.css";
// 아이콘, 이미지
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const MapAdd = memo(({ zoomLevel }) => {
  const dispatch = useDispatch();
  const { data: data, loading: loading, error: error } = useSelector((state) => state.MapSlice);
  const { data: data2, loading: loading2, error: error2 } = useSelector((state) => state.ThemeSlice);
  const { theme } = useQueryString();
  const [markers, setMarkers] = useState([]);
  const [newLoc, setNewLoc] = useState();
  const [map, setMap] = useState();
  const [infowindow, setInfowindow] = useState();
  const [ps, setPs] = useState();
  const [location, setLocation] = useState();
  const [idList, setIdList] = useState({});
  const [modalContent, setModalContent] = useState(0);
  // 키워드 검색한 결과 데이터
  const [searchData, setSearchData] = useState();
  // 장소 등록 모달
  const { modalIsOpen1, modalIsOpen2, modalIsOpen3 } = useSelector((state) => state.MapAddSlice);
  // 장소 리뷰 모달

  /**
   * 처음 열릴때 지도를 렌더링하고 전체 데이터를 가져옴 (1회)
   */
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      // 이젠 아카데미 위도 경도
      center: new kakao.maps.LatLng(37.5025506249856, 127.02485228946493),
      level: zoomLevel,
    };
    const map = new kakao.maps.Map(container, options);
    setMap(map);
    console.log("🗺️ 지도 렌더링");

    // 리플에 등록된 장소데이터를 가져옵니다 (중복인지 확인 위함)
    dispatch(getMapData()).then((e) => {
      // console.log(e.payload);

      let obj = {};
      e.payload.forEach((v, i) => {
        obj[v.place_id] = i;
      });

      // console.log(obj);
      setIdList(obj);
    });

    // 테마 데이터
    dispatch(getThemeData());

    // 장소 검색 객체를 생성합니다
    const ps = new kakao.maps.services.Places();
    setPs(ps);

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1, disableAutoPan: true });
    setInfowindow(infowindow);
  }, []);

  // 키워드로 장소를 검색합니다
  const onSearchSubmit = useCallback((e) => {
    e.preventDefault();
    var keyword = document.getElementById("keyword").value;

    console.log(keyword + "을 검색했습니다.");

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB);
  });

  // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      displayPlaces(data);

      console.log(data);
      setSearchData(data);

      // 페이지 번호를 표출합니다
      displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  // 검색 결과 목록과 마커를 표출하는 함수입니다
  function displayPlaces(places) {
    var listEl = document.getElementById("placesList"),
      menuEl = document.getElementById("menu_wrap"),
      fragment = document.createDocumentFragment(),
      bounds = new kakao.maps.LatLngBounds(),
      listStr = "";

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function (marker, title) {
        kakao.maps.event.addListener(marker, "mouseover", function () {
          displayInfowindow(marker, title);
        });

        kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close();
        });

        itemEl.onmouseover = function () {
          displayInfowindow(marker, title);
        };

        itemEl.onmouseout = function () {
          infowindow.close();
        };
      })(marker, places[i].place_name);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
  function getListItem(index, places) {
    const category = places.category_name.split(">").reverse()[0].trim();

    var el = document.createElement("li"),
      itemStr = '<div class="info">' + "   <h1>" + places.place_name + "</h1>" + "<h4>" + category + "</h4> <a href=" + places.place_url + " target='_blank'>🗺️</a><a>";

    if (places.road_address_name) {
      itemStr += places.road_address_name;
    } else {
      itemStr += places.address_name;
    }

    itemStr += "</a></div>";

    el.innerHTML = itemStr;
    el.className = "item";

    // 목록 클릭시 지도 중심좌표 이동
    el.addEventListener("click", (e) => {
      const moveLatLng = new kakao.maps.LatLng(places.y, places.x);
      map.panTo(moveLatLng);
      setLocation(places);
    });

    var btn = document.createElement("div");

    let btnStr = null;
    if (Object.keys(idList).includes(places.id)) {
      btnStr = " <div class='choiceBtn'> 🗺️ </div> </div>";
    } else {
      btnStr = " <div class='choiceBtn'> + </div> </div>";
    }

    btn.innerHTML = btnStr;
    el.appendChild(btn);

    btn.addEventListener("click", (e) => {
      dispatch(modalOpen1());
    });

    return el;
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  function addMarker(position, idx, title) {
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker); // 배열에 생성된 마커를 추가합니다

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    setMarkers([]);
  }

  // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
  function displayPagination(pagination) {
    var paginationEl = document.getElementById("pagination"),
      fragment = document.createDocumentFragment(),
      i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
      var el = document.createElement("a");
      el.href = "#";
      el.innerHTML = i;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
  // 인포윈도우에 장소명을 표시합니다
  function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

    infowindow.setContent(content);
    infowindow.open(map, marker);
  }

  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }

  return (
    <div className="map_wrap">
      <div id="map" style={{ width: "100%", height: "95vh", position: "relative" }}></div>

      {/* 보고있는 테마 */}
      <MapThemeBar theme={theme} ThemeData={data2} />

      <MapAddListContainer>
        <div className="title">장소 추천하기</div>
        <div id="menu_wrap">
          <div className="option">
            <div>
              <div className="formContainer">
                <form id="form">
                  <input type="text" placeholder="홍대 맛집" id="keyword" size="15" />
                  <button onClick={onSearchSubmit}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </form>
                <div className="info_already">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> 해당 테마에 이미 등록된 장소는 해당 장소의 🗺️리뷰를 볼 수 있습니다.</span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>
      </MapAddListContainer>

      {searchData?.map((v, i) => {
        const category = v.category_name.split(">").reverse()[0].trim();

        return (
          <li key={i} className="item">
            <div>
              <h1>{v.place_name}</h1>
              <h4>{category}</h4>
              <a href={v.place_url} target="_blank">
                🌐
              </a>
              <a></a>
            </div>
            <div>
              <div className="choiceBtn"></div>
            </div>
          </li>
        );
      })}
      {/* 모달창1*/}
      <MapAddModal1 modalIsOpen={modalIsOpen1} data={data} location={location} theme={data2 && data2[theme]} />
      {/* 모달창2 */}
      <MapAddModal2 modalIsOpen={modalIsOpen2} title={location?.place_name} theme={1} />
      {/* 모달창2 */}
      <MapAddModal3 modalIsOpen={modalIsOpen3} title={location?.place_name} theme={1} />
    </div>
  );
});

export default MapAdd;
