import React, { Suspense } from 'react';
import { useLocation, matchRoutes, Navigate } from 'react-router-dom';
import { routes } from '../../router';
import cookie from 'react-cookies';
import { Spin } from 'antd';

export default function BeforeEach(props) {
    const location = useLocation();
    const matchs = matchRoutes(routes, location);

    if (Array.isArray(matchs)) {
        const meta = matchs[matchs.length - 1].route.meta
        if (meta?.auth) {
            const token = cookie.load('jwtToken')
            if (!token) {
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
