import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../SingerDefault/SingerDefault.scss';
import { message } from 'antd';
import { getSingerMV } from '../../../api/mv';
import MVDisplay from '../SingerDefault/MVDisplay';
import PageComponent from '../../Common/Hooks/usePagination/usePagination';

export default function SingerMV() {

    const { id } = useParams()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [singerMV, setSingerMV] = useState([])

    useEffect(() => {
        let payload = {
            id: id,
            index: parseInt(searchParams.get('index')) || 1
        }
        getSingerMV(payload).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSingerMV(res.data.singerMV)
            }
        }).catch(() => { })
    }, [location])

    const SingerMVDisplay = <MVDisplay data={singerMV.mvs} />

    return (
        <>
            {
                singerMV.length !== 0
                    ? <>
                        <div className='singerdefault-title'>
                            <span>MV&nbsp;{singerMV.count}</span>
                        </div>
                        {SingerMVDisplay}
                        <PageComponent pageNum={Math.ceil(singerMV.count / 12)} />
                    </>
                    : null
            }
        </>
    )
}
