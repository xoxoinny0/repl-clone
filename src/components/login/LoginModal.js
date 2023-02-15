import React, { memo , useCallback, useEffect} from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalInside = styled.div`
    /* background-color: pink; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .imogi {
        font-size: 30px;
        margin-top: 40px;
    }

    .txt {
        text-align: center;
        margin-top: 30px;
        line-height: 22px;
        font-weight: bold;
    }

    .buttonBox {
        margin-top: 35px;
        display: flex;
        flex-direction: column;
        /* background-color: yellow; */
        width: 100%;
        
        button {
            padding: 20px 50px;
            margin-top: 10px;
            border-style: none;
            border-radius: 10px;
            font-family: 'S-CoreDream-3Light', 'Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif';
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;

            &:hover {
                box-shadow: 1px 2px 5px #a4a4a4;
                transition: all 0.3s;
            }
        }

        .kakao {
            background-color: #FAE100;
        }

        .naver {
            background-color: black;
            color: white;
        }

        .email {
            background-color: #DDDDDD;
        }
    }
`

const LoginModal = memo(({LMDIsOpen, onRequestClose}) => {

    const navigate = useNavigate();

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

      const onClickEmail = useCallback((e) => {
        let redirectUrl = '/login/repl';
        navigate(redirectUrl);
        onRequestClose();
      }, [navigate, onRequestClose]);


    return (
        <Modal
            isOpen={LMDIsOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {
                  backgroundColor: "rgba(50, 50, 50, 0.75)",
                  zIndex: 99999,
                },
                content: {
                  backgroundColor: "#F8F8F8",
                  width: "330px",
                  maxHeight: "1000px",
                  height: "400px",
                //   left: "300px",
                  borderRadius: "15px",
                //   padding: "40px 40px 50px",
                  margin: "auto",
                  overflowY: "hidden",
                  overscrollBehavior: "contain",
                },
            }}
        >
            <ModalInside>
                <div className='imogi'>🧙‍♂️</div>
                <div className='txt'>로그인하고 모든 기능을 이용해보세요.<br/>
                    필요한 시간은 단, 3초!</div>
                <div className='buttonBox'>
                    <button className='kakao'>카카오로 계속하기</button>
                    <button className='naver'>네이버로 계속하기</button>
                    <button className='email' onClick={onClickEmail}>이메일로 계속하기</button>
                </div>
            </ModalInside>

        </Modal>
    );
});

export default LoginModal;