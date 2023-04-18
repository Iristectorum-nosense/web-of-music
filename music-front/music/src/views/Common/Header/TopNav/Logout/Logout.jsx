import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Checkbox, Modal, Tabs, Form, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { loginAction, setCaptchaTime, subCaptchaTime, stopCaptchaTime, changeCapBtn } from '../../../../../store/slices/user';
import { captchaTimer } from '../../../../../utils/index';
import { sendCaptcha } from '../../../../../api/login';

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

    const captchaTime = useSelector((state) => state.user.captchaTime);
    const captchaBtn = useSelector((state) => state.user.captchaBtn);

    const loginEmailRef = useRef(null);

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

    const captchaTimer = () => {
        //验证码定时器
        let time = 2;
        dispatch(changeCapBtn(true))
        dispatch(setCaptchaTime({
            total: time,
            count: time,
            timerId: setInterval(() => {
                dispatch(subCaptchaTime())
            }, 1000)
        }))
        setTimeout(() => {
            dispatch(stopCaptchaTime())
            dispatch(changeCapBtn(false))
        }, time * 1000)
    };

    const handleLoginSendCap = () => {
        let inputRef = loginEmailRef.current.input;
        if (emailPattern.test(inputRef.value)) {
            captchaTimer()
            sendCaptcha(inputRef.value, inputRef.id).then((res) => {
                if (res.data.code === 200) {
                    message.success(res.data.message)
                }
            }).catch(() => { })
        } else {
            message.error('请输入正确的账号')
        }
    };

    const handleLoginByCap = (ev) => {
        if (emailPattern.test(ev.loginEmailByCap) && captchaPattern.test(ev.loginCaptcha)) {
            setLoading({
                ...loading,
                loginLoading: true,
            })
            let payload = {
                data: {
                    loginEmail: ev.loginEmailByCap,
                    loginCaptcha: ev.loginCaptcha,
                    remember: ev.loginRemByCap
                },
                method: 'byCap'
            }
            //请求登录
            dispatch(loginAction(payload)).then((action) => {
                if (JSON.stringify(action.payload) !== '{}') {
                    setVisible({
                        ...visible,
                        loginVisible: false,
                    })
                    window.location.reload(true);
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
                    setVisible({
                        ...visible,
                        loginVisible: false,
                    })
                    window.location.reload(true);
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

    useEffect(() => {
        //防止刷新导致定时器被清除
        if (captchaTime.timerId) {
            dispatch(setCaptchaTime({
                total: captchaTime.count,
                count: captchaTime.count,
                timerId: setInterval(() => {
                    dispatch(subCaptchaTime())
                }, 1000)
            }))
            setTimeout(() => {
                dispatch(stopCaptchaTime())
                dispatch(changeCapBtn(false))
            }, captchaTime.total * 1000)
        }
    }, [])

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
                                    <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='邮箱.com/net'
                                        ref={loginEmailRef} />
                                </Form.Item>
                                <Form.Item name='loginCaptcha'
                                    rules={[{ required: true, message: '请输入验证码' }]}>
                                    <div style={{ display: 'inline' }}>
                                        <Input style={{ width: '50%' }} />
                                        <Button style={{ width: '40%', marginLeft: '10%' }}
                                            disabled={captchaBtn}
                                            onClick={handleLoginSendCap}>{captchaTime.count > 0 ? `${captchaTime.count}s` : '获取验证码'}</Button>
                                    </div>
                                </Form.Item>
                                <Form.Item name='loginRemByCap' valuePropName='checked' noStyle>
                                    <Checkbox>7天内自动登录</Checkbox>
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
                                    <Checkbox>7天内自动登录</Checkbox>
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
