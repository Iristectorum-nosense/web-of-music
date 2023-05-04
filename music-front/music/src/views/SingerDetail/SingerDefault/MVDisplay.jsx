import React from 'react';
import { PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';

export default function MVDisplay({ data }) {
    return (
        <>
            <div className='singerdefault-mvList'>
                {
                    data.map((mv) => (
                        <div key={mv.id} className='singerdefault-mvList-item'>
                            <a href='#' onClick={(e) => { e.preventDefault(); }} >
                                <img src={`http://localhost:8000${mv.url}/mask/${mv.id}.png`} alt={mv.name} loading='lazy' />
                                <span className='mask'><PlayCircleOutlined /></span>
                            </a>
                            <div><a>{mv.name}</a></div>
                            <div><VideoCameraOutlined />{mv.play_count}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
