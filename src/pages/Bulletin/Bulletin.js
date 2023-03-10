import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useQueryString } from '../../hooks/useQueryString';
import Pagenation from '../../components/Pagenation';

import { useSelector, useDispatch } from 'react-redux';
import { getList } from '../../slices/bulletin/BulletinSlice';
import { getTags } from '../../slices/bulletin/HashtagSlice';

import Post from '../../components/bulletin/Post';
import Spinner from '../../components/Spinner';
import CookieHelper from '../../helper/CookieHelper';

const BannerArea = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #39f;
  font-weight: 900;

  .banner__title {
    h1 {
      font-size: 40px;
      margin-bottom: 30px;
      font-weight: 900;
    }

    p {
      font-size: 20px;
      line-height: 1.5;
    }
  }

  .linksWrap {
    width: 1200px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }

  .links {
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 5px;

    button {
        font-size: 15px;
        font-weight: 600;
        margin: 0 5px;
        padding: 6px 10px;
        background-color: #fff;
        text-decoration: none;
        color: #0581bb;
        border-radius: 12px;
        border: none;

        &:hover {
            background-color: #0581bb;
            color: #fff;
            cursor: pointer;
        }
    }
  }
`;

const MainArea = styled.section`
  width: 1200px;
  margin: auto;
  padding: 16px 32px;
  background-color: #fff;
  box-sizing: border-box;

  .main__option-bar {
    width: 100%;
    margin: auto;
    margin-bottom: 30px;

    select,
    input,
    button {
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #fff;
      margin: 0 5px;
      padding: 5px;
      font-size: 12px;
    }

    input {
        width: 500px;
    }

    button {
        padding: 5px 10px;

        &:hover {
            cursor: pointer;
            background-color: #eee;
        }
    }
  }
`;

const PostList = styled.div`
  width: 100%;
  background-color: #fff;
  margin: auto;
  box-sizing: border-box;

  .list-box {
    width: 100%;  
    display: flex;
    flex-flow: row wrap;
    margin-bottom: 30px;
  }
`;

const Bulletin = memo(() => {
    /** QueryString ?????? ?????? */
    const { query, page=1, tag } = useQueryString();
    const navigate = useNavigate();

    /** ?????????????????? ???????????? ???????????? */
    const dispatch = useDispatch();
    const { pagenation, data, loading, error } = useSelector(state => state.BulletinSlice);
    const { data: tags, loading: loading2, error: error2 } = useSelector(state => state.HashtagSlice);

    const [isUpdate, setIsUpdate] = useState(0);
    const [sort, setSort] = useState(false);
    const [isMyPost, setIsMyPost] = useState(false);

    useEffect(() => {
        console.log(pagenation, data);
    }, [data]);

    const userInfo = useMemo(() => {
        const temp = CookieHelper.getCookie('loginInfo');
        if (!temp) return null;
        else return JSON.parse(temp);
    }, []);

    // ????????? ??????
    useEffect(() => {
        dispatch(getList({
            query: query,
            tag: tag,
            page: page,
            rows: 8,
            sortByLike: sort,
            isMyPost: isMyPost,
            userId: userInfo?.id
        }));
        dispatch(getTags());
    }, [query, page, isUpdate, sort, isMyPost]);

    /** ????????? / ?????? ??? ????????? ?????? ?????? */
    const onBannerButtonClick = useCallback(e => {
        e.preventDefault();

        const loginInfo = CookieHelper.getCookie('loginInfo');
        if (!isMyPost && !loginInfo) {
            if (window.confirm('???????????? ???????????????. ????????? ???????????? ?????????????????????????')) {
                navigate('/login/repl');
                return;
            } else {
                return;
            }
        }

        const target = e.currentTarget.dataset.target;

        switch (target) {
            case 'mypost': setIsMyPost(state => !state); break;
            case 'newpost': navigate('/bulletin/newpost/*'); break;
            default: break;
        }
    }, []);

    /** ?????? ?????? ????????? ?????? State??? */
    const [classification, setClassification] = useState(0);
    const [tagOptions, setTagOptions] = useState([]);
    const [tagValues, setTagValues] = useState([]);

    // ?????? ?????? ????????? ?????????
    const onSortWayChange = useCallback(e => {
        e.preventDefault();

        const way = e.currentTarget.value;

        setSort(state => {
            return (way === 'p');
        });
    }, []);

    // ????????? select ????????? ?????????
    const onCategoryFieldChange = useCallback(e => {
        e.preventDefault();

        const fieldIndex = e.currentTarget.value;
        setClassification(fieldIndex);
    }, []);

    useEffect(() => {
        if (classification == 0) {
            setTagOptions([]);
            setTagValues([]);
        } else {
            setTagOptions(tags[classification - 1].values);
            setTagValues(tags[classification - 1].ids);
        }
    }, [classification]);

    // ????????? select ????????? ?????????
    const onSubCategoryChange = useCallback(e => {
        e.preventDefault();

        // setSelectedTag(state => parseInt(e.currentTarget.value));
        let redirectUrl = `/bulletin?tag=${e.currentTarget.value}`;
        redirectUrl = query ? redirectUrl + `&query=${query}` : redirectUrl;
        navigate(redirectUrl);
        setIsUpdate(state => state + 1);
    }, []);

    /** ????????? ?????? ????????? */
    const onPostQuerySubmit = useCallback(e => {
        e.preventDefault();

        let redirectUrl = '/bulletin?';
        const query = e.currentTarget.query.value;

        if (query) redirectUrl += `query=${query}`;
        if (tag) redirectUrl += `&tag=${tag}`;

        navigate(redirectUrl);
    }, [tag]);

    return (
        <>
            <BannerArea>
                {
                    isMyPost ? (
                        <>
                            <div className="banner__title">
                                <h1>??? ?????????</h1>
                                <p>?????? ?????? ?????? ?????????????????????.</p>
                            </div>
                            <div className="linksWrap">
                                <div className='links'>
                                <button data-target='mypost' onClick={onBannerButtonClick}>- ?????? ????????? -</button>
                                <button data-target='newpost' onClick={onBannerButtonClick}>- ????????? -</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="banner__title">
                                <h1>???????????? ?????? ?????????</h1>
                                <p>???????????? ?????? ????????? ?????? ????????? ???????????? ?????? ????????????.<br/>????????? ???????????? ???????????? ???????????? ????????? ????????? ?????? ???????????? ?????? ???????????????.</p>
                            </div>
                            <div className="linksWrap">
                                    <div className='links'>
                                        <button data-target='mypost' onClick={onBannerButtonClick}>- ??? ????????? -</button>
                                        <button data-target='newpost' onClick={onBannerButtonClick}>- ????????? -</button>
                                    </div>
                            </div>
                        </>
                    )
                }
            </BannerArea>

            <MainArea>
                <form className='main__option-bar' onSubmit={onPostQuerySubmit}>
                    <select name="align" id="align" onChange={onSortWayChange}>
                        <option value="l">?????????</option>
                        <option value="p">?????????</option>
                    </select>
                    <select name="category" id="category" onChange={onCategoryFieldChange}>
                        <option value="0">-- ???????????? --</option>
                        {
                            tags && tags.map((v, i) => {
                                return (
                                    <option key={i} value={i + 1}>{v.subject}</option>
                                )
                            })
                        }
                    </select>
                    <select name="subCategory" id="subCategory" onChange={onSubCategoryChange}>
                        <option value="-1">-- ?????? ???????????? --</option>
                        {
                            tagOptions && tagOptions.map((v, i) => {
                                return (
                                    <option key={i} value={tagValues[i]}>{v}</option>
                                )
                            })
                        }
                    </select>
                    <input type="text" name="query" placeholder="???????????? ???????????????."></input>
                    <button type='submit'>????????????</button>
                </form>

                <PostList>
                    <div className='list-box'>
                        {
                            loading ? (
                                <Spinner loading={loading} />
                            ) : (
                                data && data?.map((v, i) => {
                                    return (
                                        <Post
                                            key={i}
                                            targetId={v.id}
                                            postTitle={
                                                v.title ? v.title : (
                                                    v.postTitle ? v.postTitle : '????????????'
                                                )
                                            }
                                            backgroundImage={
                                                v.bgimage ? v.bgimage : (
                                                    v.backgroundImage ? v.backgroundImage : ''
                                                )
                                            }
                                            backgroundColor={
                                                v.bgcolor ? v.bgcolor : (
                                                    v.bgColor ? v.bgColor : '#fff'
                                                )
                                            }
                                            postUser={
                                                v.username ? v.username : (
                                                    v.postUser ? v.postUser : '?????????'
                                                )
                                            }
                                            like={v.like}
                                            postDate={
                                                v.postdate ? v.postdate : (
                                                    v.postDate ? v.postDate : '0000-00-00'
                                                )
                                            }
                                            selectedTags={
                                                v.tags ? v.tags : (
                                                    v.selectedTags ? v.selectedTags : []
                                                )
                                            }
                                        />
                                    );
                                })
                            )
                        }
                    </div>

                    {pagenation && (<Pagenation pagenation={pagenation} />)}
                </PostList>
            </MainArea>
        </>
    );
});

export default Bulletin;