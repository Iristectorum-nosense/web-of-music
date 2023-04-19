import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Checkbox, Modal, Tabs, Form, message, Radio } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import {
    loginAction, registerAction, resetPwAction,
    setCaptchaTime, subCaptchaTime, stopCaptchaTime, changeCapBtn
} from '../../../../store/slices/login';
import { sendCaptcha } from '../../../../api/login';

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

    const captchaTime = useSelector((state) => state.login.captchaTime);
    const captchaBtn = useSelector((state) => state.login.captchaBtn);

    const emailRef = useRef(null);

    const [registerForm] = Form.useForm();
    const [resetPwForm] = Form.useForm();

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

    const emailPattern = /^[\w+@((\w+\.){1,2})(com|net)]{8,32}$/g
    const captchaPattern = /^[0-9]{6}$/g
    const passwordPattern = /^[a-zA-Z0-9~!@#$%^&*()_+`={}|:";'<>?,.]{6,18}$/g
    const nickNamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,18}$/g

    const captchaTimer = () => {
        //验证码定时器
        let time = 10;
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

    const handleSendCap = () => {
        let inputRef = emailRef.current.input;
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

    const registerPwValidator = (_, value) => {
        if (registerForm.getFieldValue('registerPassword') !== value) {
            return Promise.reject('两次密码输入不一致')
        }
        return Promise.resolve()
    };

    const resetPwValidator = (_, value) => {
        if (resetPwForm.getFieldValue('resetPassword') !== value) {
            return Promise.reject('两次密码输入不一致')
        }
        return Promise.resolve()
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

    const handleRegister = (ev) => {
        registerForm.validateFields().then((values) => {
            if (emailPattern.test(values.registerEmail) && passwordPattern.test(ev.registerPassword)
                && nickNamePattern.test(ev.nickName) && captchaPattern.test(ev.registerCaptcha)) {
                setLoading({
                    ...loading,
                    registerLoading: true,
                })
                let payload = {
                    registerEmail: ev.registerEmail,
                    nickName: ev.nickName,
                    gender: ev.gender,
                    registerPassword: ev.registerPassword,
                    registerCaptcha: ev.registerCaptcha,
                }
                //请求注册
                dispatch(registerAction(payload)).then((action) => {
                    if (JSON.stringify(action.payload) !== '{}') {
                        setVisible({
                            ...visible,
                            registerVisible: false,
                        })
                        window.location.reload(true);
                    }
                    setLoading({
                        ...loading,
                        registerLoading: false,
                    })
                })
            } else {
                message.error('请输入正确的信息')
            }
        }).catch(() => {
            ev.prevetDefault();
        })
    };

    const handleResetPw = (ev) => {
        resetPwForm.validateFields().then((values) => {
            if (emailPattern.test(values.resetEmail) && passwordPattern.test(ev.resetPassword)
                && captchaPattern.test(ev.resetCaptcha)) {
                setLoading({
                    ...loading,
                    resetLoading: true,
                })
                let payload = {
                    resetEmail: ev.resetEmail,
                    resetPassword: ev.resetPassword,
                    resetCaptcha: ev.resetCaptcha,
                }
                //请求重置密码
                dispatch(resetPwAction(payload)).then((action) => {
                    if (JSON.stringify(action.payload) !== '{}') {
                        setVisible({
                            ...visible,
                            loginVisible: true,
                            resetVisible: false,
                        })
                    }
                    setLoading({
                        ...loading,
                        resetLoading: false,
                    })
                })
            } else {
                message.error('请输入正确的信息')
            }
        }).catch(() => {
            ev.prevetDefault();
        })
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
        <>
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
                                        ref={emailRef} />
                                </Form.Item>
                                <Form.Item name='loginCaptcha'
                                    rules={[{ required: true, message: '请输入验证码' }]}>
                                    <div style={{ display: 'inline' }}>
                                        <Input style={{ width: '50%' }} />
                                        <Button style={{ width: '40%', marginLeft: '10%' }}
                                            disabled={captchaBtn}
                                            onClick={handleSendCap}>{captchaTime.count > 0 ? `${captchaTime.count}s` : '获取验证码'}</Button>
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
                                    <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='xxx@xx.com/net' />
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
                onCancel={() => modalReset('close')}
                footer={[
                    <Button type='primary' key='login' style={{ float: 'left' }} onClick={() => modalLogin('open')}
                    >返回
                    </Button>,
                    <Button type='primary' key='register' onClick={() => modalRegister('open')}
                    >没有账号 ? 注册
                    </Button>
                ]}
            >
                <Form onFinish={(ev) => handleResetPw(ev)} form={resetPwForm}
                    style={{ margin: '5% 0 10% 0' }}>
                    <Form.Item name='resetEmail' label='邮&ensp;&ensp;箱'
                        rules={[{ required: true, message: '请输入邮箱' }]} >
                        <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='xxx@xx.com/net'
                            ref={emailRef} />
                    </Form.Item>
                    <Form.Item name='resetPassword' label='密&ensp;&ensp;码'
                        rules={[{ required: true, message: '请输入密码' }]} >
                        <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password'
                            placeholder='6~18位,仅含数字/字母/特殊字符' />
                    </Form.Item>
                    <Form.Item name='resetVerifyPw' label='确&ensp;&ensp;认'
                        rules={[{ required: true, message: '' }, { validator: resetPwValidator }]}
                        validateTrigger='onBlur' >
                        <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password'
                            placeholder='再次输入密码' />
                    </Form.Item>
                    <Form.Item name='resetCaptcha'
                        label='验证码'
                        rules={[{ required: true, message: '请输入验证码' }]} >
                        <div style={{ display: 'inline' }}>
                            <Input style={{ width: '50%' }} />
                            <Button style={{ width: '40%', marginLeft: '10%' }}
                                disabled={captchaBtn}
                                onClick={handleSendCap}>{captchaTime.count > 0 ? `${captchaTime.count}s` : '获取验证码'}</Button>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' loading={loading.resetLoading} style={{ marginTop: '5%', width: '100%' }}>重置密码</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={visible.registerVisible}
                onCancel={() => modalRegister('close')}
                footer={null}
            >
                <Form onFinish={(ev) => handleRegister(ev)} form={registerForm}
                    initialValues={{ gender: 0 }}
                    style={{ margin: '5% 0 10% 0' }}>
                    <Form.Item name='registerEmail' label='邮&ensp;&ensp;箱'
                        rules={[{ required: true, message: '请输入邮箱' }]} >
                        <Input prefix={<MailOutlined className='site-form-item-icon' />} placeholder='xxx@xx.com/net'
                            ref={emailRef} />
                    </Form.Item>
                    <Form.Item name='nickName' label='昵&ensp;&ensp;称'
                        rules={[{ required: true, message: '请输入昵称' }]} >
                        <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='4~18位,不含特殊字符' />
                    </Form.Item>
                    <Form.Item name='gender' label='性&ensp;&ensp;别'
                        rules={[{ required: true, message: '' }]}>
                        <Radio.Group style={{ width: '100%' }}>
                            <Radio value={1} style={{ width: '35%', marginLeft: '10%' }}>男</Radio>
                            <Radio value={0} style={{ width: '35%', marginLeft: '10%' }}>女</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='registerPassword' label='密&ensp;&ensp;码'
                        rules={[{ required: true, message: '请输入密码' }]} >
                        <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password'
                            placeholder='6~18位,仅含数字/字母/特殊字符' />
                    </Form.Item>
                    <Form.Item name='registerVerifyPw' label='确&ensp;&ensp;认'
                        rules={[{ required: true, message: '' }, { validator: registerPwValidator }]}
                        validateTrigger='onBlur' >
                        <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password'
                            placeholder='再次输入密码' />
                    </Form.Item>
                    <Form.Item name='registerCaptcha'
                        label='验证码'
                        rules={[{ required: true, message: '请输入验证码' }]} >
                        <div style={{ display: 'inline' }}>
                            <Input style={{ width: '50%' }} />
                            <Button style={{ width: '40%', marginLeft: '10%' }}
                                disabled={captchaBtn}
                                onClick={handleSendCap}>{captchaTime.count > 0 ? `${captchaTime.count}s` : '获取验证码'}</Button>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' loading={loading.registerLoading} style={{ marginTop: '5%', width: '100%' }}>注册</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </ >
    )
}
