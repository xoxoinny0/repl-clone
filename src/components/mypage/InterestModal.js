import React, { memo , useCallback, useEffect} from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../slices/InfoSlice';
import { getInterest } from '../../slices/InterestSlice';
import PageButton from '../../components/mypage/PageButton';

const ModalInside = styled.div`
    /* background-color: pink; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

`

const InterestBox = styled.div`
    .tagCon {   
        width: 90%;
        margin: 100px auto;
        position: relative;

        .tag {
            
            background-color: #f3f5f7;
            padding: 10px;
            display: inline-block;
            margin-top: 20px;
            margin-right: 10px;
            border-radius: 10px;
            border: none;
            cursor: pointer;

            .imgIcon {
                padding-right: 5px;
            }

            &:hover {
                scale: 1.05;
                transition: 0.1s;
                background-color: #0584BB;
                color: white;
            }

            &.active {
              background-color: #0584BB;
              color: white;
            } 
            
        }

        
        
        .addButton {
            position: absolute;
            right: 0;
            bottom: -70px;
        }
    }
`

const InterestModal = memo(({IMDIsOpen, onRequestClose, idInterestData}) => {

    const dispatch = useDispatch();
    const { data:data2, loading:loading2, error:error2} = useSelector((state) => state.InterestSlice);

    useEffect(() => {
        document.body.style.cssText = `
          position: fixed; 
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
        return () => {
          const scrollY = document.body.style.top;
          document.body.style.cssText = "";
          window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        };
      }, []);

      useEffect(()=> {
          dispatch(getInterest());
      }, [dispatch])
     
      console.log("data2", data2);
      console.log("idInterestData",idInterestData);
      
      const onClickInterBtn = useCallback((e)=> {
        console.log("Click");

      });

    return (
        <Modal
            isOpen={IMDIsOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {
                  backgroundColor: "rgba(50, 50, 50, 0.75)",
                  zIndex: 99999,
                },
                content: {
                  backgroundColor: "#F8F8F8",
                  width: "820px",
                  maxHeight: "1000px",
                  height: "400px",
                  borderRadius: "15px",
                  margin: "auto",
                  overflowY: "hidden",
                  overscrollBehavior: "contain",
                },
            }}
        >
            <ModalInside>
                <InterestBox>
                    <div className='tagCon'>
                      {data2?.map((v, i) => {
                          return (
                              <button key={v.id} className={idInterestData?.find((v2,i) => v2.id === v.id)? 'tag active' :  'tag' } onClick={onClickInterBtn} >
                                  <span className='imgIcon'>{v.icon}</span>
                                  <span>{v.dsec}</span>
                              </button>
                          )
                      })}
                      <PageButton className='addButton'>관심사 수정하기</PageButton>
                    </div>
                </InterestBox>
            </ModalInside>

        </Modal>
    );
});

export default InterestModal;