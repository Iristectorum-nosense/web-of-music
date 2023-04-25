import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetUserInfos } from '../../api/user';
import { resetUserInfo } from '../../store/slices/login';
import cookie from 'react-cookies';
import axios from 'axios';
import { Form, Radio, Button, Input, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './MySetting.scss';

const getBase64 = (img, callback) => {
    //图像64位编码
    const reader = new FileReader();
    console.log('--3', reader)
    reader.addEventListener('load', () => callback(reader.result));
    console.log('--4', reader)
    reader.readAsDataURL(img);
    console.log('--5', reader)
};

const beforeUpload = (file) => {
    //上传前的限制
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传JPG/PNG图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片过大');
    }
    return isJpgOrPng && isLt2M;
};

export default function MySettng() {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState({
        uploading: false,
        saveLoading: false,

    })
    const [imageUrl, setImageUrl] = useState();

    const loginInfos = useSelector((state) => (state.login.loginInfos))

    const nickNamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,18}$/g

    const handleResetInfos = (ev) => {
        if (nickNamePattern.test(ev.resetNickName)) {
            setLoading({
                ...loading,
                saveLoading: true
            })
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                nickname: ev.resetNickName,
                gender: ev.resetGender
            }
            resetUserInfos(payload).then((res) => {
                if (res.data.code === 405) {
                    message.error(res.data.message)
                } else {
                    message.success('修改成功')
                    dispatch(resetUserInfo(payload))
                }
            }).catch(() => { })
            setLoading({
                ...loading,
                saveLoading: false
            })
        } else {
            message.error('请输入正确的昵称')
        }
    }

    const handleChange = (info) => {
        console.log('1', info)
        if (info.file.status === 'uploading') {
            setLoading({
                ...loading,
                uploading: true
            });
            return;
        }
        if (info.file.status === 'done') {
            console.log('--2', info.file.originFileObj)
            getBase64(info.file.originFileObj, (url) => {
                console.log('--6', url)
                setLoading({
                    ...loading,
                    uploading: true
                });
                setImageUrl(url);
            });
        }
    };

    const upload = (info) => {
        console.log('2', info)
        let param = new FormData()  // 创建form对象
        param.append('file', info.file)  // 通过append向form对象添加数据
        console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        // 添加请求头
        axios.post('http://localhost:8000/user/resetPortrait', param, config)
            .then(res => {
                console.log(res.data)
            })
    };

    return (
        <div className='header-wrapper'>
            <h2 style={{ margin: '5% 0 2% 0' }}>个人设置</h2>
            <hr />
            <Form onFinish={(ev) => handleResetInfos(ev)}
                initialValues={{
                    resetNickName: loginInfos.nickname,
                    resetGender: loginInfos.gender
                }}
                style={{ margin: '5% 0', padding: '0 10%' }}>
                <Form.Item name='resetNickName' label='昵&ensp;&ensp;称'
                    rules={[{ required: true, message: '请输入昵称' }]} >
                    <Input placeholder='4~18位,不含特殊字符' />
                </Form.Item>
                <Form.Item name='resetGender' label='性&ensp;&ensp;别'
                    rules={[{ required: true, message: '' }]}>
                    <Radio.Group style={{ width: '100%' }}>
                        <Radio value={1} style={{ width: '35%', marginLeft: '10%' }}>男</Radio>
                        <Radio value={0} style={{ width: '35%', marginLeft: '10%' }}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' loading={loading.saveLoading} style={{ marginTop: '5%', width: '100%' }}>保存</Button>
                </Form.Item>
            </Form>
            <div className='upload'>
                <ImgCrop rotationSlider>
                    <Upload
                        name='avatar'
                        listType='picture-card'
                        showUploadList={false}
                        customRequest={upload}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {
                            imageUrl
                                ? (<img src={imageUrl} alt='avatar' style={{ width: '100%' }} />)
                                : (<div>
                                    {loading.uploading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>
                                        上传头像
                                    </div>
                                </div>)
                        }
                    </Upload>
                </ImgCrop>
            </div>

        </div>
    )
}
