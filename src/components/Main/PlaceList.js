import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { getMapData } from "../../slices/MapSlice";
import { getThemeData } from "../../slices/ThemeSlice";
import { getTP } from "../../slices/MapThemeSlice";

import LocModal from "../../common/LocModal";

const ListContainer = styled.div`
  margin-bottom: 30px;
  width: 60%;
  margin: auto;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
    li {
      width: 24%;
      background-color: #f8f8f8;
      text-decoration: none;
      padding: 20px;
      margin: 10px 0 20px 0;
      box-sizing: border-box;
      border-radius: 12px;
      cursor: pointer;

      div {
        display: block;
        div {
          margin-bottom: 5px;
          &:last-child {
            margin-bottom: 0;
          }
          &.text {
            font-size: 16px;
            color: #666;
            font-weight: 600;
          }
          &.address {
            font-size: 12px;
            color: #adadad;
            font-weight: 500;
            margin: 10px 0;
          }
          &.theme {
            font-size: 12px;
            color: #666;
            font-weight: 200;
          }
        }
      }
    }
  }
`;

const PlaceList = memo(() => {
  const [modalContent, setModalContent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [LocData, setLocData] = useState();
  const [ThemeData, setThemeData] = useState();

  const { data, loading } = useSelector((state) => state.MapSlice);
  const { data: data2 } = useSelector((state) => state.ThemeSlice);
  const { data: data3 } = useSelector((state) => state.MapThemeSlice);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMapData());
    dispatch(getThemeData());
    dispatch(getTP());
  }, []);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  // const randomData = data && [...data]?.sort(() => Math.random() - 0.5);
  const randomData = useMemo(() => {
    return data && [...data]?.sort(() => Math.random() - 0.5);
  }, [data]);

  // 모달창 이벤트
  const onModalIsOpen = useCallback((e) => {
    e.preventDefault();
    setModalContent(e.currentTarget.dataset.id);
    setIsModalOpen(true);
    console.log("모달창 열림 id: " + e.currentTarget.dataset.id);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.cssText = `
            position: fixed; 
            top: -${window.scrollY}px;
            overflow-y: scroll;
            width: 100%;
        `;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
  }, [isModalOpen]);

  return (
    <ListContainer>
      <ul>
        {randomData &&
          randomData
            ?.map(({ id, place_name, address_name }, i) => {
              return (
                <li key={i} onClick={onModalIsOpen} data-id={id}>
                  <div>
                    <div className="place_name">{place_name}</div>
                    <div className="address">{address_name}</div>
                    <div className="theme" key={i}>
                      
                      {data3 && data3
                        ?.filter((item) => item.place_id === id)
                        ?.map((v, i) => v.theme_id)
                        ?.map((v2, i2) => {
                          return (
                            
                            <div key={i2}>
                              {data2 && data2[v2].icon} {data2 && data2[v2].text}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </li>
              );
            })
            ?.slice(0, 4)}
      </ul>

      {data?.map((v, i) => {
        let themeList = [];
        if (ThemeData) {
          v.theme.forEach((v2, i2) => {
            themeList.push(ThemeData[v2]);
          });
        }

        if (v.id == modalContent) {
          return <LocModal key={i} isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} data={v} theme={themeList} style={{ content: { width: "300px" } }} />;
        }
      })}
    </ListContainer>
  );
});

export default PlaceList;
