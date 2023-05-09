import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { PlusSquareOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import PageComponent from '../usePagination/usePagination';
import { formatPublish } from '../../../../utils/format';
import './useAlbumList.scss';
import { useLocation } from 'react-router-dom';
import { useClickNavigate } from '../useClickNavigate';
import { deleteLikeAlbum } from '../../../../api/user';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { AlbumImgURL } from '../../../../utils/staticURL';

function useAlbumList(setReload) {

    const loginInfos = useSelector((state) => state.login.loginInfos)

    const handleDeleteClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            albumId: id
        }
        deleteLikeAlbum(payload).then((res) => {
            if (res.data.code === 200) {
                message.success('删除成功')
                setReload(true)
            }
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('删除失败,请一会儿重试')
        }).catch(() => { })
    }

    return { handleDeleteClick };
}


export default function AlbumListComponent({ haveImg = true, haveDelete = true, haveIndex = true, data = [], pageNum = 0, setReload }) {
    //haveImg:是否显示专辑图片
    //haveIndex:是否需要分页

    const { handleDeleteClick } = useAlbumList(setReload)

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
                                            ? <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} ><img src={AlbumImgURL(album.url, album.id)} alt={album.name} loading='lazy' /></a>
                                            : null
                                    }
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} >{album.name}</a>
                                    <a><PlayCircleOutlined /></a>
                                    {
                                        haveDelete ? <a href='#' onClick={(e) => { e.preventDefault(); handleDeleteClick(album.id) }}><DeleteOutlined /></a> : null
                                    }
                                </span>
                                <span>
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