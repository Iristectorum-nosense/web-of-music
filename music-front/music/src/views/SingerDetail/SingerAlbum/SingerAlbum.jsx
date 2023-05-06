import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../SingerDefault/SingerDefault.scss';
import { getSingerAlbum } from '../../../api/album';
import { message } from 'antd';
import PageComponent from '../../Common/Hooks/usePagination/usePagination';
import AlbumDisplay from '../SingerDefault/AlbumDisplay';

export default function SingerAlbum() {

    const { id } = useParams()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [singerAlbum, setSingerAlbum] = useState([])

    useEffect(() => {
        let payload = {
            id: id,
            index: parseInt(searchParams.get('index')) || 1
        }
        getSingerAlbum(payload).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSingerAlbum(res.data.singerAlbum)
            }
        }).catch(() => { })
    }, [location])

    const SingerAlbumDisplay = <AlbumDisplay data={singerAlbum.albums} />

    return (
        <>
            {
                singerAlbum.length !== 0
                    ? <>
                        <div className='singerdefault-title'>
                            <span>专辑&nbsp;{singerAlbum.count}</span>
                        </div>
                        {SingerAlbumDisplay}
                        <PageComponent pageNum={Math.ceil(singerAlbum.count / 12)} />
                    </>
                    : null
            }
        </>
    )
}
