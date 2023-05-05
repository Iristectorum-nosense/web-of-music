import React from 'react';
import './HomeMV.scss';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';
import { PlayCircleOutlined } from '@ant-design/icons';

export default function HomeMVComponent({ data = [], index = 1 }) {

    const showData = data.slice((index - 1) * 6, index * 6)
    const { handleMVClick, handleSingerClick } = useClickNavigate()

    return (
        <div className='home-mv'>
            {
                showData.map((mv) => (
                    <div key={mv.id} className='home-mv-item'>
                        <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >
                            <img src={`http://localhost:8000${mv.url}/mask/${mv.id}.png`} alt={mv.name} loading='lazy' />
                            <span className='mask'><PlayCircleOutlined /></span>
                        </a>
                        <div>
                            <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }}>{mv.name}</a>
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
    )
}