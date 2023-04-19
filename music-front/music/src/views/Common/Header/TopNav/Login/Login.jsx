import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../../../../../store/slices/user';
import cookie from 'react-cookies';
import { Avatar, Dropdown, Space } from 'antd';
import userDefault from '../../../../../source/user.png';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

export default function Login() {
    const dispatch = useDispatch()
    const loginInfos = useSelector((state) => state.user.loginInfos)

    const onClick = (ev) => {
        if (ev.key === 'setting') {
        }
        if (ev.key === 'logout') {
            cookie.remove('jwtToken')
            dispatch(clearUserInfo())
            window.location.reload(true)
        }
    }

    const items = [
        {
            key: 'setting',
            label: (
                <Space>
                    <SettingOutlined className='site-form-item-icon' />
                    <span>个人设置</span>
                </Space>
            ),
        },
        {
            key: 'logout',
            label: (
                <Space>
                    <LogoutOutlined className='site-form-item-icon' />
                    <span>&ensp;退&ensp;&ensp;出&ensp;</span>
                </Space>
            ),
        }

    ]

    return (
        <>
            <Dropdown menu={{ items, onClick }} placement='bottomRight'>
                {
                    loginInfos.portrait === 'none' || loginInfos.portrait === ''
                        ? <Avatar src={userDefault}>default</Avatar>
                        : <Avatar >222</Avatar>
                }
            </Dropdown>
        </>
    )
}
