import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const PagenationContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 40px auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;

    .link {
        text-decoration: none;
        transition: all 0.3s;
        padding: 5px 10px;
        margin: 0 2px;
        color: black;

        &.active {
            background-color: #747474;
            color: white;
        }

        &.disabled {
            color: #999;
            cursor: no-drop;
        }

        &:not(.active):hover {
            background-color: #19381a;
            color: white;
            border: 1px solid #19381a;
        }

        &:not(.disabled):hover {
            background-color: #19381a;
            color: white;
            border: 1px solid #19381a;
        }
    }
`;

const Pagenation = memo(({pagenation: { groupEnd, groupStart, nextGroupFirstPage, nowPage, prevGroupLastPage, totalPage }}) => {
    // 현재 URL
    const { pathname, search } = useLocation();

    // 페이지 번호 링크를 포함하는 <li>를 리턴하는 함수
    const pageNumber = useCallback((currentPage, targetPage, linkText) => {
        // QueryString 문자열을 객체로 변환
        const params = new URLSearchParams(search);
        // params 객체에 page번호 파라미터 추가
        params.set('page', targetPage);
        // params 객체를 다시 QueryString 문자열로 변환
        const qs = params.toString();
        // 최종 URL을 추출
        let targetURL = `${pathname}?${qs}`;

        // 출력할 텍스트가 전달되지 않은 경우 페이지 번호로 대체
        if (!linkText) {
            linkText = targetPage;
        }

        // 비활성 상태 링크
        if (targetPage === 0) {
            return (
                <li key={targetPage + linkText}><span dangerouslySetInnerHTML={{ __html: linkText }} className='link disabled' /></li>
            );
        } else if (targetPage === currentPage) {
            if (isNaN(linkText)) {
                return ( 
                    <li key={targetPage + linkText}><span dangerouslySetInnerHTML={{ __html: linkText}} className='link disabled' /></li> 
                );
            }
            else {
                return (
                    <li key={targetPage + linkText}><span dangerouslySetInnerHTML={{ __html: linkText}} className='link active' /></li>
                );
            }   
        } else {
            return (
                <li key={targetPage + linkText}><Link to={targetURL} dangerouslySetInnerHTML={{ __html: linkText}}  className='link' /></li>
            );
        }
    }, []);

    // 스크롤바 최상단 강제이동
    window.scrollTo(0, 0);

    return (
        <PagenationContainer>
            {/** 첫 페이지로 이동 */}
            {pageNumber(nowPage, 1, '&laquo;')}

            {/** 이전 그룹의 마지막 페이지로 이동 */}
            {pageNumber(nowPage, prevGroupLastPage, '&lt;')}

            {/** 페이지 수만큼 출력하기 */}
            {new Array(groupEnd - groupStart + 1).fill(groupStart).map((v, i) => pageNumber(nowPage, v + i))}

            {/** 다음 그룹의 첫 페이지로 이동 */}
            {pageNumber(nowPage, nextGroupFirstPage, '&gt;')}

            {/** 끝 페이지로 이동 */}
            {pageNumber(nowPage, totalPage, '&raquo;')}
        </PagenationContainer>
    );
});

Pagenation.defaultProps = { 
    pagenation: {
        groupEnd: 0,
        groupStart: 0,
        nextGroupFirstPage: 0,
        nowPage: 1,
        prevGroupLastPage: 0,
        totalPage: 1
    }
};

export default Pagenation;