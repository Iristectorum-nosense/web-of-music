import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLikeAlbum } from '../../../api/user';
import AlbumListComponent from '../../Common/Hooks/useAlbumList/useAlbumList';
import '../../MyMusic/myMusic.scss';
import '../MyMusicLike.scss';

export default function LikeAlbum() {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [likeAlbum, setLikeAlbum] = useState([])
    const [reload, setReload] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    useEffect(() => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            index: parseInt(searchParams.get('index')) || 1
        }
        getLikeAlbum(payload).then((res) => {
            if (res.data.code === 200) {
                setLikeAlbum(res.data.likeAlbum)
            }
        }).catch(() => { })

        return () => {
            setReload(false)
        }
    }, [location, reload])

    const LikeAlbumList = <AlbumListComponent data={likeAlbum.albums} pageNum={Math.ceil(likeAlbum.count / 10)} setReload={setReload} />

    return (
        <>
            {
                likeAlbum.length !== 0 && likeAlbum.count !== 0
                    ? <>
                        {LikeAlbumList}
                    </>
                    : likeAlbum.length !== 0
                        ? <span className='mymusic-null'>还没有内容哦，快去首页收藏更多精彩内容吧~</span> : null
            }
        </>
    )
}
