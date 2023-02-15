import React, { memo, useEffect, useCallback, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getThemeData } from "../../slices/ThemeSlice";
import Spinner from '../Spinner';

/** glider
 * https://www.npmjs.com/package/react-glider
 */
import Glider from "react-glider";
import "glider-js/glider.min.css";
import "../../assets/css/styles.scss";

const Slider = memo(() => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.ThemeSlice);
  const gliderRef1 = useRef(null);
  const preventInterval = useRef(null);
  const dataLengthRef = useRef(0);
  const mouseover = useRef(true);
  let randomData = data&&[...data]?.sort(() => Math.random() - 0.5);
  dataLengthRef.current = randomData; 


  useEffect(() => {
    dispatch(getThemeData());
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
    
      if (preventInterval.current) {
        return;
      }

      gliderRef1.current?.scrollItem(index++ % dataLengthRef.current?.length, false);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const onMouseOver = useCallback((e) => {
    mouseover.current = true;
    preventInterval.current = true;

  }, [mouseover]);

  const onMouseOut = useCallback((e) => {
    mouseover.current = false;
    preventInterval.current = false;
    
  }, [mouseover]);

  return (
    
    <div
      className="container"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <Spinner loading={loading}/>
       
      <Glider
        className="glider-container"
        draggable
        hasArrows={mouseover}
        slidesToShow={1}
        slidesToScroll={1}
        ref={gliderRef1}
      >
        {randomData?.map(({ id, icon, text, user_number }, i) => {
          return (
            <div key={i}>
              <NavLink to={`/map?theme=${id}`}>
                <div className="emoji">{icon}</div>
                <div className="text">{text}</div>
                <div className="user_number">{user_number}명의 사용자</div>
              </NavLink>
            </div>
          );
        })}
      </Glider>
      
    </div>
  );
});

export default Slider;
