import React from 'react';
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import './myMusic.scss';
import axios from 'axios';
import { Button } from 'antd';
import PageComponent from '../Common/Hooks/usePagination/usePagination';


export default function MyMusic() {

    const insert = () => {
        axios.get('http://localhost:8000/user/insert')
    }

    const testPage = <PageComponent pageNum={10} />

    return (
        <>
            <Header></Header>
            <div className='header-wrapper'>
                music
                {testPage}
            </div>
            <Footer></Footer>
            <Button onClick={insert}></Button>
        </>
    )
}
