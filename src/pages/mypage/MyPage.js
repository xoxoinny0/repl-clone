import '../../assets/css/fonts.css';
import React, { memo } from 'react';
import styled from 'styled-components';

import Info from './Info';
import Interests from './Interests';
import Map from './Map';
import Follow from './Follow';
import Noti from './Noti';

import { useSelector, useDispatch } from 'react-redux';
import { setTab } from '../../slices/MyPageSlice';

const MenuTab = styled.nav`
    position: fixed;
    top: 50%;
    transform: translate(0,-70%);
    display: flex;
    flex-direction: column;
`

const TabMenu = styled.ul`

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

    &.focused {
        color: white;
        background-color: #0584BB;
        border-color: #0584BB;

        &:after {
            border-bottom: 4px solid #fff !important;
        }
    }
`;

const MyPage = memo(() => {

    const { currentTab } = useSelector((state) => state.MyPageSlice)
    const dispatch = useDispatch();

    // const [currentTab, setCurrentTab] = React.useState(0);

    const menuArr = [
        '내 정보관리',
        '내 관심사',
        '나의 지도 관리',
        '팔로워/팔로잉',
        '신고 목록',
      ];
    
      const selectMenuHandler = (index) => {
        dispatch(setTab(index));
      };

    return (
        <div>
            <MenuTab>
                {menuArr.map((v, index)=>{
                    return (
                    <TabMenu
                        key={index}
                        className={currentTab === index ? "submenu focused" : "submenu"}
                        onClick={()=> selectMenuHandler(index)}
                        >
                    {v}
                    </TabMenu>
                    )
                })}
            </MenuTab>
            {currentTab === 0 && <Info/>}
            {currentTab === 1 && <Interests/>}
            {currentTab === 2 && <Map/>}
            {currentTab === 3 && <Follow/>}
            {currentTab === 4 && <Noti/>}
        </div>
    );
});

export default MyPage;