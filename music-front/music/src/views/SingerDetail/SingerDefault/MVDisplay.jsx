import React from 'react';
import { PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';
import { MVImgURL } from '../../../utils/staticURL';

export default function MVDisplay({ data }) {

    const { handleMVClick } = useClickNavigate()

    return (
        <>
            <div className='singerdefault-mvList'>
                {
                    data.map((mv) => (
                        <div key={mv.id} className='singerdefault-mvList-item'>
                            <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >
                                <img src={MVImgURL(mv.url, mv.id)} alt={mv.name} loading='lazy' />
                                <span className='mask'><PlayCircleOutlined /></span>
                            </a>
                            <div>
                                <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >{mv.name}</a>
                            </div>
                            <div><VideoCameraOutlined />{mv.play_count}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
