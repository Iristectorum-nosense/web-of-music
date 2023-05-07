import React, { useEffect } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import { useLocation, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { setLikeMV } from '../../api/user';

export default function MVDetail() {

    const { id } = useParams()
    const location = useLocation()
    const loginInfos = useSelector((state) => state.login.loginInfos)

    useEffect(() => {

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

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {id}
            <div>
                <Button onClick={() => { handleLikeClick(id) }}><HeartOutlined />我喜欢</Button>
            </div>
        </div>
    )
}
