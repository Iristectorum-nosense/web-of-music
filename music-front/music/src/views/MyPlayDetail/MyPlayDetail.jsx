import React, { useEffect, useState } from 'react';
import '../MyMusic/myMusic.scss';
import './MyPlayDetail.scss';
import { FormOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import SongListComponent from '../Common/Hooks/useSongList/useSongList';
import { editPlay, getMyPlayInfo } from '../../api/user';
import { useSelector } from 'react-redux';

export default function MyPlayDetail() {

    const { id } = useParams()
    const location = useLocation()
    const [myPlayInfo, setMyPlayInfo] = useState([])
    const [reload, setReload] = useState(false)
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    const namePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,18}$/g

    const handleEditClick = () => {
        setVisible(true)
    }

    const modalEdit = (props) => {
        switch (props) {
            case 'open': setVisible(true); break;
            default:
            case 'close': setVisible(false); break;
        }
    }

    const handleEdit = (e) => {
        if (namePattern.test(e.playName)) {
            setLoading(true)
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playId: id,
                playName: e.playName
            }
            editPlay(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('修改成功')
                    setVisible(false)
                }
                else if (res.data.code === 405) message.error(res.data.message)
                else message.error('修改失败,请一会儿重试')
            }).catch(() => { })
            setLoading(false)
        } else {
            message.error('请输入正确的歌单名')
        }
    }

    useEffect(() => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            playId: id
        }
        getMyPlayInfo(payload).then((res) => {
            if (res.data.code === 200) setMyPlayInfo(res.data.myPlayInfo)
            else if (res.data.code === 405) message.error(res.data.message)
        }).catch(() => { })
    }, [location, reload])

    const MyPlaySongList = <SongListComponent haveImg={false} haveIndex={false} data={myPlayInfo} setReload={setReload} type='playSong' playSongId={id} />

    return (
        <>
            <div className='myplay-info'>
                <div className='myplay-info-button'>
                    <Button onClick={handleEditClick}><FormOutlined />修改歌单</Button>
                </div>
                {
                    myPlayInfo.length !== 0
                        ? <>
                            {MyPlaySongList}
                        </>
                        : <span className='mymusic-null'>还没有内容哦，快去首页收藏更多精彩内容吧~</span>
                }
            </div>
            <Modal
                open={visible} destroyOnClose
                onCancel={() => modalEdit('close')}
                footer={null}
            >
                <Form onFinish={(ev) => handleEdit(ev)}
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
