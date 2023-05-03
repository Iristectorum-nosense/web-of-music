import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Button } from 'antd';
import { CustomerServiceOutlined, PlusSquareOutlined, BarsOutlined } from '@ant-design/icons';

function useSongList() {

    const [bulk, setBulk] = useState(false)

    const handlePlayClick = (ev) => {
        console.log(ev)
    }

    const handleFavorClick = (ev) => {
        console.log(ev)
    }

    const handleBulkClick = () => {
        if (bulk) setBulk(false)
        else setBulk(true)
    }

    return { bulk, handlePlayClick, handleFavorClick, handleBulkClick };
}


export default function SongListComponent({ haveIndex = true, styleDefs = {} }) {

    const { bulk, handlePlayClick, handleFavorClick, handleBulkClick } = useSongList()

    const token = cookie.load('jwtToken')



    return (
        <div className={styleDefs.content}>
            <div className={styleDefs.button}>
                <Button><CustomerServiceOutlined />播放全部</Button>
                <Button disabled={!token} onClick={handleFavorClick}><PlusSquareOutlined />收藏</Button>
                <Button onClick={handleBulkClick}><BarsOutlined />{
                    bulk ? '取消批量操作' : '批量操作'
                }</Button>
            </div>
            <div className={styleDefs.list}>
                111
            </div>
            <div>

            </div>
        </div>
    )
}