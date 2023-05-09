import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getSearch } from '../../../api/search';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';
import { PlayCircleOutlined } from '@ant-design/icons';
import { MVImgURL } from '../../../utils/staticURL';

export default function SearchAlbum() {

    const location = useLocation()
    const [searchInfo, setSearchInfo] = useState('')
    const { info } = useParams()

    useEffect(() => {
        let payload = {
            type: 3,
            info: info
        }
        getSearch(payload).then((res) => {
            if (res.data.code === 200) {
                setSearchInfo(res.data.search)
            }
        }).catch(() => { })
    }, [location])

    const { handleMVClick, handleSingerClick } = useClickNavigate()

    return (
        <div>
            {
                searchInfo.length !== 0
                    ? <div className='mvList-content'>
                        {
                            searchInfo.map((mv) => (
                                <div key={mv.id} className='mvList-item'>
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >
                                        <img src={MVImgURL(mv.url, mv.id)} alt={mv.name} loading='lazy' />
                                        <span className='mask'><PlayCircleOutlined /></span>
                                    </a>
                                    <div>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >{mv.name}</a>
                                    </div>
                                    <div>
                                        {
                                            mv.singers.map((singer) => (
                                                <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                    {singer.name}
                                                </a>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    : <span className='search-null'>没有搜索到您要的结果呢~</span>
            }
        </div>
    )
}