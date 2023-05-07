import { Button, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlayCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import '../MyMusic//myMusic.scss';
import './MyMusicCreate.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPublish } from '../../utils/format';
import PageComponent from '../Common/Hooks/usePagination/usePagination';
import { createPlay, deletePlay, editPlay, getPlay } from '../../api/user';
import { useSelector } from 'react-redux';


export default function MyMusicCreate() {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [myPlay, setMyPlay] = useState([])
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    const namePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,18}$/g

    useEffect(() => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            index: parseInt(searchParams.get('index')) || 1
        }
        getPlay(payload).then((res) => {
            if (res.data.code === 200) {
                setMyPlay(res.data.myPlay)
            }
        }).catch(() => { })
        return () => {
            setReload(false)
        }
    }, [location, reload])

    const handleMyPlayClick = (id) => {
        navigate(`/myMusic/myPlayDetail/${id}`)
    }

    const handleDeleteClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            playId: id
        }
        deletePlay(payload).then((res) => {
            if (res.data.code === 200) {
                message.success('删除成功')
                setReload(true)
            }
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('删除失败,请一会儿重试')
        }).catch(() => { })
    }

    const handleCreateClick = () => {
        setVisible(true)
    }

    const modalCreate = (props) => {
        switch (props) {
            case 'open': setVisible(true); break;
            default:
            case 'close': setVisible(false); break;
        }
    }

    const handleCreate = (e) => {
        if (namePattern.test(e.playName)) {
            setLoading(true)
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playName: e.playName
            }
            createPlay(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('创建成功')
                    setVisible(false)
                    setReload(true)
                }
                else if (res.data.code === 405) message.error(res.data.message)
                else message.error('创建失败,请一会儿重试')
            }).catch(() => { })
            setLoading(false)
        } else {
            message.error('请输入正确的歌单名')
        }
    }


    return (
        <>
            <div className='mymusic-create'>
                <div className='mymusic-create-content-button'>
                    <Button onClick={handleCreateClick}><PlusOutlined />创建歌单</Button>
                </div>
                {
                    myPlay.length !== 0 && myPlay.count !== 0
                        ? <>
                            <div className='mymusic-create-content-list'>
                                <ul className='mymusic-create-content-list-header'>
                                    <li>歌单</li>
                                    <li>曲目数</li>
                                    <li>创建时间</li>
                                </ul>
                                <ul>
                                    {
                                        myPlay.plays.map((play) => (
                                            <li key={play.id} className='mymusic-create-content-list-item' >
                                                <span>
                                                    <a href='#' onClick={(e) => { e.preventDefault(); handleMyPlayClick(play.id) }} >{play.name}</a>
                                                    <a><PlayCircleOutlined /></a>
                                                    <a href='#' onClick={(e) => { e.preventDefault(); handleDeleteClick(play.id) }}><DeleteOutlined /></a>
                                                </span>
                                                <span>
                                                    {play.count}
                                                </span>
                                                <span>{formatPublish(play.publish)}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <PageComponent pageNum={Math.ceil(myPlay.count / 10)} />
                        </> : myPlay.length !== 0
                            ? <span className='mymusic-null'>还没有内容哦，快去首页收藏更多精彩内容吧~</span> : null
                }
            </div>
            <Modal
                open={visible} destroyOnClose
                onCancel={() => modalCreate('close')}
                footer={null}
            >
                <Form onFinish={(ev) => handleCreate(ev)}
                    style={{ margin: '5% 0 10% 0' }}
                >
                    <Form.Item name='playName' label='歌单名'
                        rules={[{ required: true, message: '请输入歌单名' }]} >
                        <Input placeholder='2~18位,不含特殊字符' />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' loading={loading} style={{ marginTop: '5%', width: '100%' }}>确认</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
