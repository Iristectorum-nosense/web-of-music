import React, { useState, useEffect } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import TagComponent from '../Common/Hooks/useTag';
import { useLocation } from 'react-router-dom';
import './RankList.scss';
import SongListComponent from '../Common/Hooks/useSongList';
import { getRankList } from '../../api/song';

export default function TopList() {
    const tagDefs = [
        {
            param: 'top',
            options: [
                { name: '热歌榜', value: 1 }, { name: '新歌榜', value: 2 }, { name: '内地榜', value: 3 }, { name: '欧美榜', value: 4 }, { name: '日韩榜', value: 5 }
            ]
        }
    ]

    const initialOption = {
        top: { name: '热歌榜', value: 1 }
    }

    const styleTagDefs = {
        tag: 'rankList-tag',
        list: 'rankList-tag-list',
        item: 'rankList-tag-item',
        itemSelected: 'rankList-tag-item rankList-tag-item-selected'
    }

    const RankListTag = <TagComponent initialOption={initialOption} tagDefs={tagDefs} styleDefs={styleTagDefs} />

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [rankList, setRankList] = useState([])

    useEffect(() => {
        getRankList(parseInt(searchParams.get('top')) || 1).then((res) => {
            if (res.data.code === 200) {
                setRankList(res.data.rankList)
            }
        }).catch(() => { })
    }, [location])

    const RankListSongList = <SongListComponent haveIndex={false} data={rankList} />

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            <div className='rankList'>
                {RankListTag}
                {RankListSongList}
            </div>
        </div>
    )
}
