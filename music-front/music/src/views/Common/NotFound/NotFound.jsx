import React from 'react';
import Componenet404 from '../../../source/404.png';

export default function NotFound() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20%' }}>
            <img src={Componenet404} alt='页面找不到' />
        </div>
    )
}
