import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Button } from 'antd';
import { CustomerServiceOutlined, FolderAddOutlined, PlusSquareOutlined, BarsOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import PageComponent from './usePagination';
import { formatTime } from '../../../utils/format';
import './useSongList.scss';
import { useLocation } from 'react-router-dom';
import { useClickNavigate } from './useClickNavigate';

function useSongList(data) {
    const [bulk, setBulk] = useState(false)
    const [optionAll, setOptionAll] = useState(true)
    const [options, setOptions] = useState(
        data.map((song) => ({
            id: song.id,
            option: true,
        }))
    )

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const pageIndex = parseInt(searchParams.get('index')) || 1

    useEffect(() => {
        setBulk(false)
    }, [location])

    useEffect(() => {
        setOptions(data.map((song) => ({
            id: song.id,
            option: true,
        })));
    }, [data])

    useEffect(() => {
        const allChecked = options.every((option) => option.option === true)
        setOptionAll(allChecked)
    }, [options])

    const handlePlayClick = (ev) => {
        console.log(ev)
    }

    const handleFavorClick = (ev) => {
        console.log(ev)
    }

    const handleBulkClick = () => {
        setBulk(!bulk)
        setOptionAll(true)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: true }
            })
        )
    }

    const handleOptionChange = (id) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                if (option.id === id) {
                    return { ...option, option: !option.option }
                } else {
                    return option
                }
            })
        )
    }

    const handleOptionAll = () => {
        setOptionAll(!optionAll)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: !optionAll }
            })
        )
    }


    return {
        bulk, optionAll, options, pageIndex,
        handlePlayClick, handleFavorClick, handleBulkClick, handleOptionChange, handleOptionAll
    };
}


export default function SongListComponent({ haveOption = true, haveImg = true, haveDelete = true, haveIndex = true, data = [], pageNum = 0 }) {
    //haveOption:是否需要按钮及批量操作
    //haveImg:是否显示歌曲图片
    //haveDelete:是否显示删除歌曲图标
    //haveIndex:是否需要分页

    const { bulk, optionAll, options, pageIndex,
        handlePlayClick, handleFavorClick, handleBulkClick, handleOptionChange, handleOptionAll } = useSongList(data)


    const { handleSingerClick, handleSongClick } = useClickNavigate()

    const token = cookie.load('jwtToken')

    return (
        <div className='content'>
            {
                haveOption ? (
                    <div className='content-button'>
                        <Button><CustomerServiceOutlined />播放全部</Button>
                        <Button disabled={!token} onClick={handleFavorClick}><FolderAddOutlined />收藏</Button>
                        <Button onClick={handleBulkClick}><BarsOutlined />{
                            bulk ? '取消批量操作' : '批量操作'
                        }</Button>
                    </div>
                ) : null
            }
            <div className='content-list'>
                {
                    haveOption ? (
                        <ul className='content-list-header'>
                            <li>{bulk && <input type='checkbox' id='0' checked={optionAll} onChange={handleOptionAll} />}</li>
                            <li>歌曲</li>
                            <li>歌手</li>
                            <li>时长</li>
                        </ul>
                    ) : null
                }
                <ul>
                    {
                        data.map((song, index) => (
                            <li key={song.id} className='content-list-item' >
                                {
                                    haveOption ? (
                                        <span className='content-list-item-index'>
                                            {bulk && <input type='checkbox' id={song.id} checked={options.find((option) => option.id === song.id).option} onChange={() => handleOptionChange(song.id)} />}
                                            {(pageIndex - 1) * 10 + index + 1}
                                        </span>
                                    ) : (
                                        <span className='content-list-item-index'>
                                            {(pageIndex - 1) * 10 + index + 1}
                                        </span>
                                    )
                                }
                                <span>
                                    {
                                        haveImg
                                            ? <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }} ><img src={`http://localhost:8000${song.url}/${song.id}.png`} alt={song.name} loading='lazy' /></a>
                                            : null
                                    }
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }} >{song.name}</a>
                                    <PlayCircleOutlined />
                                    <PlusSquareOutlined />
                                    {
                                        haveDelete ? <DeleteOutlined /> : null
                                    }
                                </span>
                                <span>
                                    {
                                        song.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                {singer.name}
                                            </a>
                                        ))
                                    }
                                </span>
                                <span>{formatTime(song.time)}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
            {
                haveIndex && pageNum !== 0 ? <PageComponent pageNum={pageNum} /> : null
            }
        </div >
    )
}