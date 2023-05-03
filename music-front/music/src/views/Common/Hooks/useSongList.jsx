import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Button } from 'antd';
import { CustomerServiceOutlined, FolderAddOutlined, PlusSquareOutlined, BarsOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import PageComponent from './usePagination';
import { formatTime } from '../../../utils/format';
import './useSongList.scss';
import { useLocation } from 'react-router-dom';

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

    return { bulk, optionAll, options, handlePlayClick, handleFavorClick, handleBulkClick, handleOptionChange, handleOptionAll };
}


export default function SongListComponent({ haveOption = true, haveDelete = true, haveIndex = true, data = [] }) {

    const { bulk, optionAll, options, handlePlayClick, handleFavorClick, handleBulkClick, handleOptionChange, handleOptionAll } = useSongList(data)

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
                            <li key={song.id} className={haveOption ? 'content-list-item' : 'content-list-item-disable-index'} >
                                {
                                    haveOption ? (
                                        <span className='content-list-item-index'>
                                            {bulk && <input type='checkbox' id={song.id} checked={options.find((option) => option.id === song.id).option} onChange={() => handleOptionChange(song.id)} />}
                                            {index + 1}
                                        </span>
                                    ) : null
                                }
                                <span>
                                    <a href='#' onClick={(e) => { e.preventDefault() }} ><img src={`http://localhost:8000${song.url}/${song.id}.png`} alt={song.name} loading='lazy' /></a>
                                    <a href='#' onClick={(e) => { e.preventDefault() }} >{song.name}</a>
                                    <PlayCircleOutlined />
                                    <PlusSquareOutlined />
                                    {
                                        haveDelete ? <DeleteOutlined /> : null
                                    }
                                </span>
                                <span>
                                    {
                                        song.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault() }}>
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
                haveIndex ? <PageComponent pageNum={data.pageNum} /> : null
            }
        </div >
    )
}