import React, { memo } from 'react';
import styled from 'styled-components';
import { NavLink } from "react-router-dom";


const CreateMapContainer = styled.div`
    position: fixed;
    right: 20px;
    bottom: 30px;
    z-index: 10;
    a {
        display: inline-block;
        padding: 15px 20px;
        box-sizing: border-box;
        background-color: #DA4C1F;
        border-radius: 100px;
        text-decoration: none;
        color: #fefefe;
        letter-spacing: -0.5px;
        box-shadow: 3px 3px 8px rgb(0 0 0 / 20%);
        &:hover {
            background-color: #c4441c;
        }
        .text {
            font-size: 15px;
            margin-right: 8px;
        }
        .plus {
            font-size: 25px;
            vertical-align: middle;        
        }

    }
`;


const CreateMap = memo(() => {
  return (
    <CreateMapContainer>
        <NavLink to='/theme/create'>
            <span className='text'>테마지도 만들기</span>
            <span className='plus'>+</span>
        </NavLink>
    </CreateMapContainer>
  )
})

export default CreateMap;