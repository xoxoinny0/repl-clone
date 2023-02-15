import React, { memo, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import PageContainer from '../../components/mypage/PageContainer';
import PageButton from '../../components/mypage/PageButton';

import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../slices/InfoSlice';

import InterestModal from '../../components/mypage/InterestModal';


const InterestBox = styled(PageContainer)`
    
    .tagCon {
        width: 50%;
        margin: 100px auto;
        position: relative;
        .tag {
            
            background-color: #f3f5f7;
            padding: 10px;
            display: inline-block;
            margin-top: 20px;
            margin-right: 10px;
            border-radius: 10px;

            .imgIcon {
                padding-right: 5px;
            }
            
        }
        
        .addButton {
            position: absolute;
            right: 0;
            bottom: -70px;
        }
    }
`

const Interests = memo(() => {

    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.InfoSlice);
    
    //관심사 추가 상태관리
    const [IMDIsOpen, setIMDIsOpen] = useState(false);
    const handleInterestModal = useCallback((e) => {
        e.preventDefault();
        setIMDIsOpen(true);
      });

    
    useEffect(()=> {
        dispatch(getInfo());
    }, [dispatch])

    const idData = data?.find((v, i) => v.id === 2)
    
    return (
        <InterestBox>
            <h2>마이페이지 &gt; 내 관심사</h2>
            <div className='tagCon'>
                {idData?.interests.map((v, i) => {
                    
                    return (
                        <div key={v.id} className="tag" >
                            <span className='imgIcon'>{v.icon}</span>
                            <span>{v.dsec}</span>
                        </div>
                    )
                })}
            <PageButton className='addButton' onClick={handleInterestModal}>관심사 추가하기</PageButton>
            </div>

            {IMDIsOpen && <InterestModal IMDIsOpen={IMDIsOpen} onRequestClose={() => setIMDIsOpen(false)} idInterestData={idData?.interests}/>}
        </InterestBox>
    );
});

export default Interests;