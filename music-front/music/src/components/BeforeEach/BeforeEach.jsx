import React, { useState } from 'react';
import { useLocation, matchRoutes, Navigate } from 'react-router-dom';
import { routes } from '../../router';
import cookie from 'react-cookies';
import { checkJWT } from '../../api/login';
import { message } from 'antd';

export default function BeforeEach(props) {
    const [jwtValid, setJWTValid] = useState(false);
    const location = useLocation();
    const matchs = matchRoutes(routes, location);

    const checkToken = async () => {
        return await checkJWT(null, 'get');
    };

    if (Array.isArray(matchs)) {
        const meta = matchs[matchs.length - 1].route.meta
        console.log(location)
        console.log(matchs)
        if (meta?.auth) {
            const token = cookie.load('jwtToken')
            if (token) {
                //验证jwt令牌是否有效
                checkToken().then(() => {
                    let data = {
                        userId: 2,
                        userEmail: 'test@qq.com'
                    };
                    checkJWT(data, 'post').then((res) => {
                        if (res.data.code === 405) {
                            message.error('登录无效')
                        } else {
                            setJWTValid(true)
                        }
                    }).catch(() => { })
                }).catch(() => { })
                if (jwtValid) {
                    console.log('1')
                } else {
                    return <Navigate to='/' />
                }
            } else {
                console.log('2')
                return <Navigate to='/' />
            }
        }
    };

    return (
        <>{props.children}</>
    )
}
