import React, { useEffect, useState } from 'react';
import SongListComponent from '../../Common/Hooks/useSongList/useSongList';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLikeSong } from '../../../api/user';
import '../../MyMusic/myMusic.scss';
import '../MyMusicLike.scss';

export default function LikeSong() {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [likeSong, setLikeSong] = useState([])
    const [reload, setReload] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    useEffect(() => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            index: parseInt(searchParams.get('index')) || 1
        }
        getLikeSong(payload).then((res) => {
            if (res.data.code === 200) {
                setLikeSong(res.data.likeSong)
            }
        }).catch(() => { })

        return () => {
            setReload(false)
        }
    }, [location, reload])

    const LikeSongList = <SongListComponent haveImg={false} data={likeSong.songs} pageNum={Math.ceil(likeSong.count / 10)} setReload={setReload} />

    return (
        <>
            {
                likeSong.length !== 0 && likeSong.count !== 0
                    ? <div className='like-song'>
                        {LikeSongList}
                    </div>
                    : likeSong.length !== 0
                        ? <span className='mymusic-null'>还没有内容哦，快去首页收藏更多精彩内容吧~</span> : null
            }
        </>
    )
}
