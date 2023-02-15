
import styled from 'styled-components';

const PageButton = styled.button`
    width: ${(props) => props.width ||'130px'} ;
    height: ${(props) => props.height ||'37px'};
    background-color:${(props) => props.color ||'#C5441C'};
    border-style: none;
    border-radius: 13px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        /* scale: 1.05; */
        transition: 0.1s;
        opacity: 0.8;
    }
`

export default PageButton;