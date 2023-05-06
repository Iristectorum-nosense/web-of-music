import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons';
import PageComponent from '../usePagination/usePagination';
import { formatPublish } from '../../../../utils/format';
import './useAlbumList.scss';
import { useLocation } from 'react-router-dom';
import { useClickNavigate } from '../useClickNavigate';

function useAlbumList(data) {


    return {};
}


export default function AlbumListComponent({ haveImg = true, haveIndex = true, data = [], pageNum = 0 }) {
    //haveImg:是否显示专辑图片
    //haveIndex:是否需要分页

    const { } = useAlbumList(data)

    const { handleSingerClick, handleAlbumClick } = useClickNavigate()

    const token = cookie.load('jwtToken')

    return (
        <div className='album-content'>
            <div className='content-list'>
                <ul className='content-list-header'>
                    <li>专辑</li>
                    <li>曲目数</li>
                    <li>歌手</li>
                    <li>发行时间</li>
                </ul>
                <ul>
                    {
                        data.map((album) => (
                            <li key={album.id} className='content-list-item' >
                                <span>
                                    {
                                        haveImg
                                            ? <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} ><img src={`http://localhost:8000${album.url}/${album.id}.png`} alt={album.name} loading='lazy' /></a>
                                            : null
                                    }
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} >{album.name}</a>
                                    <PlayCircleOutlined />
                                    <PlusSquareOutlined />
                                </span>
                                <span style={{ justifySelf: 'center' }}>
                                    {album.count}
                                </span>
                                <span>
                                    {
                                        album.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                {singer.name}
                                            </a>
                                        ))
                                    }
                                </span>
                                <span>{formatPublish(album.publish)}</span>
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