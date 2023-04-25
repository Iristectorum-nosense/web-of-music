import React from 'react';
import { NavLink } from 'react-router-dom';
import './SubNav.scss';

export default function SubNav() {
    return (
        <>
            <div className='subNav-wrapper'>
                <NavLink to='/singer' className='subNav-items'>歌手</NavLink>
                <NavLink to='/rankList' className='subNav-items'>排行榜</NavLink>
                <NavLink to='/mv' className='subNav-items'>MV</NavLink>
            </div>
            <hr />
        </>
    )
}
