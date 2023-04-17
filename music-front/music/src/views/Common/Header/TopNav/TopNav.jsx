import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './TopNav.scss';
import cookie from 'react-cookies';
import Login from './Login/Login';
import Logout from './Logout/Logout';

export default function TopNav() {
    let token = cookie.load('jwtToken')
    return (
        <div className='topNav-wrapper'>
            <Link to='/' className='topNav-logo'>
                <img src={require('../../../../source/logo.png')} alt='Enjoy Music' />
            </Link>
            <NavLink to='/' className='topNav-home topNav-items'>首页</NavLink>
            <NavLink to='/myMusic' className='topNav-myMusic topNav-items'>我的音乐</NavLink>

            <div className='topNav-search'>
                搜索
            </div>
            <div className='topNav-login'>
                {
                    token ? <Login></Login> : <Logout></Logout>
                }
            </div>
        </div >
    )
}
