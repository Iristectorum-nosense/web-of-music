import React from 'react';
import './Header.scss';
import TopNav from './TopNav/TopNav';
import SubNav from './SubNav/SubNav';

export default function Header() {
    return (
        <div className='header-wrapper'>
            <TopNav></TopNav>
            <SubNav></SubNav>
        </div>
    )
}
