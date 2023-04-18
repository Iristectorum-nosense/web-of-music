import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Checkbox, Modal, Tabs, Form, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { loginAction } from '../../../../../store/slices/user';

export default function Logout() {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState({
        loginVisible: false,
        resetVisible: false,
        registerVisible: false,
    });

    const [loading, setLoading] = useState({
        loginLoading: false,
        resetLoading: false,
        registerLoading: false,
    });

    const modalLogin = (props) => {
        switch (props) {
            case 'open':
                setVisible({
                    loginVisible: true,
                    resetVisible: false,
                    registerVisible: false,
                });
                break;
            default:
            case 'close':
                setVisible({
                    loginVisible: false,
                    resetVisible: false,
                    registerVisible: false,
                });
                break;
        }
    };

    const modalReset = (props) => {
        switch (props) {
            case 'open':
                setVisible({
                    loginVisible: false,
                    resetVisible: true,
                    registerVisible: false,
                });
                break;
            default:
            case 'close':
                setVisible({
                    loginVisible: false,
                    resetVisible: false,
                    registerVisible: false,
                });
                break;
        }
    };

    const modalRegister = (props) => {
        switch (props) {
            case 'open':
                setVisible({
                    loginVisible: false,
                    resetVisible: false,
                    registerVisible: true,
                });
                break;
            default:
            case 'close':
                setVisible({
                    loginVisible: false,
                    resetVisible: false,
                    registerVisible: false,
                });
                break;
        }
    };

    const emailPattern = /^\w+@((\w+\.){1,2})(com|net)/g
    const captchaPattern = /^[0-9]{6}$/g
    const passwordPattern = /^[a-zA-Z0-9~!@#$%^&*()_+`={}|:";'<>?,.]+$/g
    const nickNamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g

    const handleLoginByCap = (ev) => {

    };

    const handleLoginByPw = (ev) => {
        if (emailPattern.test(ev.loginEmailByPw) && passwordPattern.test(ev.loginPassword)) {
            setLoading({
                ...loading,
                loginLoading: true,
            })
            let payload = {
                data: {
                    loginEmail: ev.loginEmailByPw,
                    loginPassword: ev.loginPassword,
                    remember: ev.loginRemByPw
                },
                method: 'byPw'
            }
            //请求登录
            dispatch(loginAction(payload)).then((action) => {
                if (JSON.stringify(action.payload) !== '{}') {
                    window.location.reload(true);
                    setVisible({
                        ...visible,
                        loginVisible: false,
                    })
                }
                setLoading({
                    ...loading,
                    loginLoading: false,
                })
            })
        } else {
            message.error('请输入正确的账号或密码')
        }
    };

    return (
        <div>
            <Button type='primary' size='large' onClick={() => modalLogin('open')}
            >登录
            </Button>
            <Modal
                open={visible.loginVisible}
                onCancel={() => modalLogin('close')}
                footer={[
                    <Button type='primary' key='reset' style={{ float: 'left' }} onClick={() => modalReset('open')}
                    >忘记密码 ? 找回
                    </Button>,
                    <Button type='primary' key='register' onClick={() => modalRegister('open')}
                    >没有账号 ? 注册
                    </Button>
                ]}
            >
                <Tabs defaultActiveKey='1' items={[
                    {
                        key: '1',
                        label: '验证码登录',
                        children:
                            <Form initialValues={{ loginRemByCap: true }} onFinish={(ev) => handleLoginByCap(ev)} >
                                <Form.Item name='loginEmailByCap'
                                    rules={[{ required: true, message: '请输入邮箱' }]} >
                                    <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='邮箱.com/net' />
                                </Form.Item>
                                <Form.Item name='loginCaptcha'
                                    rules={[{ required: true, message: '请输入验证码' }]}>
                                    <div style={{ display: 'inline' }}>
                                        <Input style={{ width: '50%' }} />
                                        <Button style={{ width: '40%', marginLeft: '10%' }}>获取验证码</Button>
                                    </div>
                                </Form.Item>
                                <Form.Item name='loginRemByCap' valuePropName='checked' noStyle>
                                    <Checkbox>记住密码</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType='submit' loading={loading.loginLoading} style={{ marginTop: '5%', width: '100%' }}>登录</Button>
                                </Form.Item>
                            </Form>
                    },
                    {
                        key: '2',
                        label: '密码登录',
                        children:
                            <Form initialValues={{ loginRemByPw: true }} onFinish={(ev) => handleLoginByPw(ev)}>
                                <Form.Item name='loginEmailByPw'
                                    rules={[{ required: true, message: '请输入邮箱' }]} >
                                    <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='邮箱.com/net' />
                                </Form.Item>
                                <Form.Item name='loginPassword'
                                    rules={[{ required: true, message: '请输入密码' }]}>
                                    <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
                                </Form.Item>
                                <Form.Item name='loginRemByPw' valuePropName='checked' noStyle>
                                    <Checkbox>记住密码</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType='submit' loading={loading.loginLoading} style={{ marginTop: '5%', width: '100%' }}>登录</Button>
                                </Form.Item>
                            </Form>
                    }
                ]} />
            </Modal>
            <Modal
                open={visible.resetVisible}
                onCancel={() => modalLogin('close')}
                footer={[
                    <Button type='primary' key='login' style={{ float: 'left' }} onClick={() => modalLogin('open')}
                    >返回
                    </Button>,
                    <Button type='primary' key='register' onClick={() => modalRegister('open')}
                    >没有账号 ? 注册
                    </Button>
                ]}
            >
                111
            </Modal>
            <Modal
                open={visible.registerVisible}
                onCancel={() => modalLogin('close')}
                footer={null}
            >
                111
            </Modal>
        </div >
    )
}
