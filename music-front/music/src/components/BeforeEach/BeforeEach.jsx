import React, { Suspense, useEffect, useState } from 'react';
import { useLocation, matchRoutes, Navigate } from 'react-router-dom';
import { routes } from '../../router';
import cookie from 'react-cookies';
import { useDispatch, useSelector } from 'react-redux';
import { checkJWTAction } from '../../store/slices/user';
import { Spin } from 'antd';

export default function BeforeEach(props) {
    const dispatch = useDispatch();
    const loginInfos = useSelector((state) => state.user.loginInfos);

    const location = useLocation();
    const matchs = matchRoutes(routes, location);

    const jwtValid = async () => {
        let payload = {
            userId: 2,
            email: loginInfos.email
        }
        return await dispatch(checkJWTAction(payload));
    };

    if (Array.isArray(matchs)) {
        const meta = matchs[matchs.length - 1].route.meta
        if (meta?.auth) {
            const token = cookie.load('jwtToken')
            if (token) {
                let payload = {
                    userId: 2,
                    email: loginInfos.email
                }
                let valid = true;
                //验证jwt令牌是否有效
                jwtValid().then((action) => {
                    if (action.payload) {
                        console.log('true')
                    } else {
                        // cookie.remove('jwtToken')
                        console.log('1', loginInfos)
                        valid = false;
                    }
                });
                console.log(valid)
                if (!valid) {
                    return <Navigate to='/' />
                }
            } else {
                return <Navigate to='/' />
            }
        }
    }

    return (
        <Suspense fallback={
            <Spin tip='Loading' size='large' style={{ margin: '20% 50%' }} />
        }>
            {props.children}
        </Suspense>
    )
}
