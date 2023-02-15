import React, { memo } from 'react';
import styled from 'styled-components';

const InputBox = styled.div`
    width: ${(props) => props.width || '350px'};
    height: ${(props) => props.height || '40px'};
    border-radius: 10px;
    box-shadow: 2px 2px 5px #DADADA;
    font-size: 13px;
    color: #0584BB;
    font-weight: bold;
    line-height: 3.2;
    padding: 0 10px;
    margin-bottom: 20px;
    position: relative;

    input {
        border: none;
        background-color:transparent; 
        width: 90%;
        height: 40%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        font-size: 15px;
        color: #0584BB;

        &:focus {
            outline: none;  
        }

        &::placeholder {
            color: #bdbdbd;
        }
    }
`
const PageInputBox = memo(({children, width, height}) => {
    return (
        <InputBox width={width} height={height}>
            {children}
        </InputBox>
    );
});

export default PageInputBox;