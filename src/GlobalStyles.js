
import { createGlobalStyle } from "styled-components";
import reset from 'styled-reset';
import './assets/css/fonts.css';

const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
        margin: 0;
        padding: 0;
    }
    
    div,nav,h2,p,input{
        font-family: 'S-CoreDream-3Light', 'Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif';  
    }

`

export default GlobalStyles;