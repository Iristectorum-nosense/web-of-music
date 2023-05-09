import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import SubNav from '../Common/Header/SubNav/SubNav';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { setLikeMV } from '../../api/user';
import { getMVInfo } from '../../api/mv';
import './MVDetail.scss';
import { formatPublish } from '../../utils/format';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { MVMp4URL, MVOggURL, MVWebmURL } from '../../utils/staticURL';

export default function MVDetail() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [mvInfo, setMVInfo] = useState([])
    const loginInfos = useSelector((state) => state.login.loginInfos)

    const token = cookie.load('jwtToken')

    useEffect(() => {

    })

    useEffect(() => {
        getMVInfo(id).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setMVInfo(res.data.mvInfo)
            }
        }).catch(() => { })
    }, [location])

    const handleLikeClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            mvId: id
        }
        setLikeMV(payload).then((res) => {
            if (res.data.code === 200) message.success('收藏成功,请在我喜欢中查看')
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('收藏失败,请一会儿重试')
        }).catch(() => { })
    }

    const { handleSingerClick } = useClickNavigate()

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {
                mvInfo.length !== 0
                    ? <div className='mv-info'>
                        <div className='mv-info-content'>
                            <div className='mv-info-video'>
                                <video controls preload='metadata' id='video' autoPlay muted >
                                    <source src={MVMp4URL(mvInfo.url, mvInfo.id)} type='video/mp4' />
                                    <source src={MVWebmURL(mvInfo.url, mvInfo.id)} type='video/webm' />
                                    <source src={MVOggURL(mvInfo.url, mvInfo.id)} type='video/ogg' />
                                    <p>Your browser doesn't support HTML5 video.</p>
                                </video>
                            </div>
                            <div className='mv-info-title'>
                                <div>
                                    <div>
                                        <span>{mvInfo.name}&nbsp;/</span>
                                        {
                                            mvInfo.singers.map((singer) => (
                                                <a key={singer.id} href='#' onClick={(e) => {
                                                    e.preventDefault()
                                                    handleSingerClick()
                                                }}>{singer.name}</a>
                                            ))
                                        }
                                    </div>
                                    {
                                        token ? <Button onClick={() => { handleLikeClick(id) }}><HeartOutlined />我喜欢</Button> : null
                                    }
                                </div>
                                <div>
                                    <span>发行时间：{formatPublish(mvInfo.publish)}</span>
                                    <span>播放量：{mvInfo.play_count}</span>
                                </div>
                                <div>视频简介：{mvInfo.desc}</div>
                            </div>
                        </div>
                    </div> : null
            }
        </div>
    )
}
