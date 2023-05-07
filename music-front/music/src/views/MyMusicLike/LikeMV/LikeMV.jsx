import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteLikeMV, getLikeMV } from '../../../api/user';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import '../../MyMusic/myMusic.scss';
import '../MyMusicLike.scss';
import PageComponent from '../../Common/Hooks/usePagination/usePagination';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';
import { message } from 'antd';

export default function LikeMV() {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [likeMV, setLikeMV] = useState([])
    const [reload, setReload] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    useEffect(() => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            index: parseInt(searchParams.get('index')) || 1
        }
        getLikeMV(payload).then((res) => {
            if (res.data.code === 200) {
                setLikeMV(res.data.likeMV)
            }
        }).catch(() => { })

        return () => {
            setReload(false)
        }
    }, [location, reload])

    const { handleMVClick, handleSingerClick } = useClickNavigate()

    const handleDeleteClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            mvId: id
        }
        deleteLikeMV(payload).then((res) => {
            if (res.data.code === 200) {
                message.success('删除成功')
                setReload(true)
            }
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('删除失败,请一会儿重试')
        }).catch(() => { })
    }

    return (
        <>
            {
                likeMV.length !== 0 && likeMV.count !== 0
                    ? <>
                        <div className='like-mv'>
                            {
                                likeMV.mvs.map((mv) => (
                                    <div key={mv.id} className='like-mv-item'>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >
                                            <img src={`http://localhost:8000${mv.url}/mask/${mv.id}.png`} alt={mv.name} loading='lazy' />
                                            <span className='mask'><PlayCircleOutlined /></span>
                                        </a>
                                        <div className='like-mv-item-delete'>
                                            <a href='#' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }} >{mv.name}</a>
                                            <a href='#' onClick={(e) => { e.preventDefault(); handleDeleteClick(mv.id) }}><DeleteOutlined /></a>
                                        </div>
                                        <div>
                                            {
                                                mv.singers.map((singer) => (
                                                    <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                        {singer.name}
                                                    </a>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <PageComponent pageNum={Math.ceil(likeMV.count / 12)} />
                    </>
                    : likeMV.length !== 0
                        ? <span className='mymusic-null'>还没有内容哦，快去首页收藏更多精彩内容吧~</span> : null
            }
        </>
    )
}
