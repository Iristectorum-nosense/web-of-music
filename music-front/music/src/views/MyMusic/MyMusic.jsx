import React from 'react';
import TopNav from '../Common/Header/TopNav/TopNav';
import Footer from '../Common/Footer/Footer';
import './myMusic.scss';


export default function MyMusic() {
    return (
        <div>
            <div className='myMusic-header'>
                <TopNav></TopNav>
            </div>
            music
            <Footer></Footer>
        </div>
    )
}
