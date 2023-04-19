import React, { useState, useEffect } from 'react';
import { Form, Radio, Button, Input, Upload } from 'antd';
import './MySetting.scss';

export default function MySettng() {

    const [loading, setLoading] = useState(false)

    const [resetInfosForm] = Form.useForm()

    const handleResetInfos = (ev) => {
    }



    return (
        <div className='header-wrapper'>
            <h2 style={{ margin: '5% 0 2% 0' }}>个人设置</h2>
            <hr />
            <Form onFinish={(ev) => handleResetInfos(ev)} form={resetInfosForm}
                initialValues={{

                }}
                style={{ margin: '5% 0 5% 0', padding: '0 10%' }}>
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
                <Form.Item name='portrait'>
                    <span>toux</span>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' loading={loading} style={{ marginTop: '5%', width: '100%' }}>保存</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
