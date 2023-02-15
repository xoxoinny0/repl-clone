import React from 'react';
import styled from 'styled-components';
import  { NavLink } from "react-router-dom";

const MenuLinkContainer = styled(NavLink)`
    font-size: 20px;
    cursor: pointer;
    text-decoration: none;
    padding: 10px;
    color: #222;
    border: 1px solid #D2D1D1;
    border-radius: 0 50px 50px 0;
    box-sizing: border-box;
    font-size: 17px;
    width: 200px;
    margin-bottom: 10px;
    text-align: center;
    
    &:hover {
        color: #0584BB;
    }

    &.active {
        color: white;
        background-color: #0584BB;
        border-color: #0584BB;

        &:after {
            border-bottom: 4px solid #fff !important;
        }
    }
`

const MenuLink = ({to, children}) => <MenuLinkContainer to={to}>{children}</MenuLinkContainer>;
    


export default MenuLink;