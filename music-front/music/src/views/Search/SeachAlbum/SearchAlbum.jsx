import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AlbumListComponent from '../../Common/Hooks/useAlbumList/useAlbumList';
import { getSearch } from '../../../api/search';

export default function SearchAlbum() {

    const location = useLocation()
    const [searchInfo, setSearchInfo] = useState('')
    const { info } = useParams()

    useEffect(() => {
        let payload = {
            type: 2,
            info: info
        }
        getSearch(payload).then((res) => {
            if (res.data.code === 200) {
                setSearchInfo(res.data.search)
            }
        }).catch(() => { })
    }, [location])

    const AlbumList = <AlbumListComponent haveDelete={false} haveIndex={false} data={searchInfo} />

    return (
        <div>
            {
                searchInfo.length !== 0
                    ? AlbumList
                    : <span className='search-null'>没有搜索到您要的结果呢~</span>
            }
        </div>
    )
}
