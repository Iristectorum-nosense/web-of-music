import React from 'react';

import SubNav from '../Common/Header/SubNav/SubNav';
import axios from 'axios';
import { Button } from 'antd';


export default function TopList() {
    const insert = () => {
        axios.get('http://localhost:8000/user/insert')
    }
    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            toplist
            <Button onClick={insert}></Button>
        </div>
    )
}
