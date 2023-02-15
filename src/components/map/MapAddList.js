import styled from "styled-components";

export const MapAddListContainer = styled.div`
  position: fixed;
  top: 60px;
  left: 10px;
  z-index: 1;
  width: 270px;
  max-height: 95vh;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 10px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  background-color: white;
  box-sizing: border-box;
  letter-spacing: -0.5px;

  .title {
    background-color: #da4c1f;
    height: 50px;
    padding: 10px 0;
    text-align: center;
    box-sizing: border-box;
    font-size: 16px;
    color: #fefefe;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 2px;
  }

  #menu_wrap {
    padding: 20px 15px;

    form {
      margin-bottom: 20px;
      font-family: "S-CoreDream-3Light", "Spoqa Han Sans", "Spoqa Han Sans JP", "Sans-serif";
      position: relative;

      input {
        height: 44px;
        border: 0;
        background-color: #ebebeb;
        border-radius: 5px;
        width: 190px;
        margin-right: 5px;
        padding: 0 8px;
        box-sizing: border-box;
      }
      button {
        font-weight: 600;
        letter-spacing: 1px;
        height: 44px;
        width: 44.44px;
        border-radius: 5px;
        background-color: white;
        border: 1px solid #da4c1f;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;

        &:hover {
          background-color: #da4c1f;
          color: white;
        }
      }
    }

    .info_already {
      color: #da4c1f;
      font-size: 13px;
      display: flex;
      margin-bottom: 10px;
      line-height: 20.8px;
      word-break: break-all;

      .fa-circle-info {
        display: block;
        padding-top: 10px;
        /* box-sizing: border-box; */
        font-size: 20px;
        line-height: 41.5px;
      }

      span {
        margin-left: 10px;
      }
    }

    #placesList {
      .kakao {
        color: #007cff;
        font-size: 10px;
        background-color: #f9e000;
      }
    }

    #pagination {
      text-align: center;
      position: sticky;
      background-color: white;
      border-top: 3px solid #bbb;
      bottom: 0;
      a {
        display: inline-block;
        font-weight: 600;
        color: #777;
        margin: 10px;
        text-decoration: none;

        &.on {
          color: black;
        }
      }
    }
  }

  .item {
    padding: 13px 0;
    width: 240px;
    height: 70px;
    border-bottom: 1px solid #bbb;
    position: relative;

    &:hover {
      background-color: #eee;
    }

    &.hover {
      background-color: #eee;
    }

    h2 {
      width: 50px;
      font-size: 15px;
      letter-spacing: 1px;
      margin-right: 10px;

      p {
        font-size: 11px;
        margin-top: 3px;

        color: #888;
      }
    }

    .info {
      width: 240px;
    }

    h1 {
      width: 200px;
      font-size: 17px;
      font-weight: 600;
      display: block;
      margin-bottom: 5px;
      line-height: 23.8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: black;
    }

    h4 {
      font-size: 11px;
      margin-bottom: 10px;
      color: #999;
    }

    a {
      font-size: 11px;
      margin-bottom: 8px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: none;

      &:first-of-type {
        font-size: 8px;
        color: red;
        margin-left: 5px;
        width: 13px;
        display: inline-block;
        margin: 0;
        text-align: center;
        margin-right: 5px;
        height: 13px;
        border-radius: 3px;
        line-height: 13px;
        color: white;
        transform: translate(0px, 2px);

        &:hover {
          background-color: #0581bb;
        }
      }
    }

    .btn {
      cursor: pointer;
      display: block;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      position: absolute;
      top: 10px;
      right: 15px;

      font-size: 20px;

      &.choice {
        background-color: #bbb;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        right: 10px;

        &:hover {
          background-color: #0581bb;
        }
      }
    }
  }
`;
