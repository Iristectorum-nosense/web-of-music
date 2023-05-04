import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../SingerDefault/SingerDefault.scss';
import SongListComponent from '../../Common/Hooks/useSongList';
import { getSingerSong } from '../../../api/song';
import { message } from 'antd';

export default function SingerSong() {

    const { id } = useParams()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [singerSong, setSingerSong] = useState([])

    useEffect(() => {
        let payload = {
            id: id,
            index: parseInt(searchParams.get('index')) || 1
        }
        getSingerSong(payload).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSingerSong(res.data.singerSong)
            }
        }).catch(() => { })
    }, [location])

    const SingerSongList = <SongListComponent haveImg={false} haveDelete={false} data={singerSong.songs} pageNum={Math.ceil(singerSong.count / 10)} />

    return (
        <>
            {
                singerSong.length !== 0
                    ? <>
                        <div className='singerdefault-title'>
                            <span>单曲&nbsp;{singerSong.count}</span>
                        </div>
                        <div className='singerdefault-songList'>
                            {SingerSongList}
                        </div>
                    </>
                    : null
            }
        </>
    )
}
