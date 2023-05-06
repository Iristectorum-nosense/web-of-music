import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, ClearOutlined, CloseOutlined } from '@ant-design/icons';
import './SeachBar.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounceDelay } from '../../../../utils/debounce';
import { throttleNow } from '../../../../utils/throttle';
import { getSearchBar } from '../../../../api/search';
import { useClickNavigate } from '../../Hooks/useClickNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { addSearchInfo, clearAllSearchInfo, clearSeachInfo } from '../../../../store/slices/search';

export default function SearchBar() {

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const searchInfos = useSelector((state) => state.search.searchInfos)

    const [searchBarInfo, setSearchBarInfo] = useState([])
    const [relevantShow, setRelevantShow] = useState(false)
    const [historyShow, setHistoryShow] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const inputRef = useRef(null)
    const historyRef = useRef(null)
    const relevantRef = useRef(null)

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputValue(value)
        if (!value) {
            setRelevantShow(false)
            setHistoryShow(true)
        } else {
            setRelevantShow(true)
            setHistoryShow(false)
        }
    }

    const handleDropClick = useCallback((e) => {
        if (inputRef.current) {
            //加载组件前为null
            if (e.target === inputRef.current.input) {  //如果点击input
                if (!e.target.value) {
                    setHistoryShow(true)
                } else {
                    setRelevantShow(true)
                }
            } else {
                if (historyRef.current && historyRef.current.contains(e.target)) {
                    setHistoryShow(true)
                } else {
                    setHistoryShow(false)
                }
                if (relevantRef.current && relevantRef.current.contains(e.target)) {
                    setRelevantShow(true)
                } else {
                    setRelevantShow(false)
                }
            }
        }
    }, [location])

    useEffect(() => {
        document.addEventListener('click', handleDropClick)

        return () => {
            document.removeEventListener('click', handleDropClick)
        }
    }, [handleDropClick])


    useEffect(() => {
        setInputValue('')
        setRelevantShow(false)
        setHistoryShow(false)

        return () => {
            inputRef.current = null
            historyRef.current = null
            relevantRef.current = null
        };
    }, [location])

    const handleSearchClick = throttleNow(() => {
        navigate(`/search/${inputValue.slice(0, 10)}`)
    }, 1000)

    const searchBar = debounceDelay((e) => {
        let info = e.target.value
        getSearchBar(info).then((res) => {
            if (res.data.code === 200) {
                setSearchBarInfo(res.data.searchBar)
            }
        }).catch(() => { })
    }, 300)

    const handleSearchInput = useCallback(searchBar, [location])

    const { handleSongClick, handleSingerClick, handleAlbumClick, handleMVClick } = useClickNavigate()

    const handleAddSearchInfo = (id, type, info) => {
        let payload = {
            id: id,
            type: type,
            info: info
        }
        dispatch(addSearchInfo(payload))
    }

    const handleClearAllSearchInfo = () => {
        dispatch(clearAllSearchInfo())
    }

    const handleClearSeachInfo = (id, type, info) => {
        let payload = {
            id: id,
            type: type,
            info: info
        }
        dispatch(clearSeachInfo(payload))
    }

    const handleSearchHistory = (id, type, info) => {
        switch (type) {
            case 1: handleSongClick(id); break
            case 2: handleAlbumClick(id); break
            case 3: handleSingerClick(id); break
            case 4: handleMVClick(id); break
            default: navigate(`/search/${info}`); break
        }
        handleAddSearchInfo(id, type, info)
    }

    return (
        <div className='search'>
            <Input value={inputValue} ref={inputRef}
                onChange={(e) => { handleInputChange(e); handleSearchInput(e) }}
                onPressEnter={(e) => { handleSearchClick(e); handleSearchHistory(0, 0, inputValue) }}></Input>
            <Button onClick={(e) => { handleSearchClick(e); handleSearchHistory(0, 0, inputValue) }}><SearchOutlined /></Button>
            <div className={historyShow ? 'history' : 'hidden'} ref={historyRef} >
                <div>
                    <span>历史搜索</span>
                    <a href='#' onClick={(e) => {
                        e.preventDefault();
                        handleClearAllSearchInfo()
                    }}><ClearOutlined /></a>
                </div>
                {
                    searchInfos.length !== 0
                        ? <>
                            {
                                searchInfos.map((searchItem) => (
                                    <div key={searchItem.type + searchItem.id}>
                                        <a href='#' onClick={(e) => {
                                            e.preventDefault();
                                            handleSearchHistory(searchItem.id, searchItem.type, searchItem.info)
                                        }}>{searchItem.info}</a>
                                        <a href='#' onClick={(e) => {
                                            e.preventDefault();
                                            handleClearSeachInfo(searchItem.id, searchItem.type, searchItem.info)
                                        }}><CloseOutlined /></a>
                                    </div>
                                ))
                            }
                        </>
                        : null
                }
            </div>
            {
                searchBarInfo.length === 0 ? null
                    : <div ref={relevantRef} className={relevantShow ? 'relevant' : 'hidden'}>
                        {
                            searchBarInfo.songList.length === 0 && searchBarInfo.albumList.length === 0 && searchBarInfo.singerList.length === 0 && searchBarInfo.mvList.length === 0
                                ? <span>找不到呢~</span>
                                : <>
                                    {
                                        searchBarInfo.songList.length === 0 ? null
                                            : <div className='relevant-content'>
                                                <div>单曲</div>
                                                {
                                                    searchBarInfo.songList.map((song) => (
                                                        <div key={song.id}>
                                                            <a href='#' onClick={(e) => {
                                                                e.preventDefault();
                                                                handleSongClick(song.id);
                                                                handleAddSearchInfo(song.id, 1, song.name)
                                                            }}>{song.name}</a>-
                                                            {
                                                                song.singers.map((singer) => (
                                                                    <a key={singer.id} href='#' onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleSingerClick(singer.id);
                                                                        handleAddSearchInfo(singer.id, 3, singer.name)
                                                                    }} >{singer.name}</a>
                                                                ))
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                    {
                                        searchBarInfo.albumList.length === 0 ? null
                                            : <div className='relevant-content'>
                                                <div>专辑</div>
                                                {
                                                    searchBarInfo.albumList.map((album) => (
                                                        <div key={album.id}>
                                                            <a href='#' onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAlbumClick(album.id);
                                                                handleAddSearchInfo(album.id, 2, album.name)
                                                            }}>{album.name}</a>-
                                                            {
                                                                album.singers.map((singer) => (
                                                                    <a key={singer.id} href='#' onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleSingerClick(singer.id);
                                                                        handleAddSearchInfo(singer.id, 3, singer.name)
                                                                    }} >{singer.name}</a>
                                                                ))
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                    {
                                        searchBarInfo.singerList.length === 0 ? null
                                            : <div className='relevant-content'>
                                                <div>歌手</div>
                                                {
                                                    searchBarInfo.singerList.map((singer) => (
                                                        <div key={singer.id}>
                                                            <a href='#' onClick={(e) => {
                                                                e.preventDefault();
                                                                handleSingerClick(singer.id);
                                                                handleAddSearchInfo(singer.id, 3, singer.name)
                                                            }}>{singer.name}</a>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                    {
                                        searchBarInfo.mvList.length === 0 ? null
                                            : <div className='relevant-content'>
                                                <div>MV</div>
                                                {
                                                    searchBarInfo.mvList.map((mv) => (
                                                        <div key={mv.id}>
                                                            <a href='#' onClick={(e) => {
                                                                e.preventDefault();
                                                                handleMVClick(mv.id);
                                                                handleAddSearchInfo(mv.id, 4, mv.name)
                                                            }}>{mv.name}</a>-
                                                            {
                                                                mv.singers.map((singer) => (
                                                                    <a key={singer.id} href='#' onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleSingerClick(singer.id);
                                                                        handleAddSearchInfo(singer.id, 3, singer.name)
                                                                    }} >{singer.name}</a>
                                                                ))
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                </>
                        }
                    </div>
            }
        </div>
    )
}