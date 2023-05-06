import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SongListComponent from '../../Common/Hooks/useSongList/useSongList';
import { getSearch } from '../../../api/search';

export default function SearchSong() {

    const location = useLocation()
    const [searchInfo, setSearchInfo] = useState('')
    const { info } = useParams()

    useEffect(() => {
        console.log(info)
        let payload = {
            type: 1,
            info: info
        }
        getSearch(payload).then((res) => {
            if (res.data.code === 200) {
                setSearchInfo(res.data.search)
            }
        }).catch(() => { })
    }, [location])

    const SongList = <SongListComponent haveImg={false} haveDelete={false} haveIndex={false} data={searchInfo} />

    return (
        <div>
            {
                searchInfo.length !== 0
                    ? SongList
                    : <span className='search-null'>没有搜索到您要的结果呢~</span>
            }
        </div>
    )
}
