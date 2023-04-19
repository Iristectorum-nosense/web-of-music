import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import BeforeEach from "../components/BeforeEach/BeforeEach";
import { Spin } from 'antd';

const App = lazy(() => import('../App'));
const Home = lazy(() => import('../views/Home/Home'));
const Artist = lazy(() => import('../views/Artist/Artist'));
const MV = lazy(() => import('../views/MV/MV'));
const RankList = lazy(() => import('../views/RankList/RankList'));
const MySettng = lazy(() => import('../views/MySetting/MySettng'));
const MyMusic = lazy(() => import('../views/MyMusic/MyMusic'));
const NotFound = lazy(() => import('../views/Common/NotFound/NotFound'));
const NotServer = lazy(() => import('../views/Common/NotServer/NotServer'));


export const routes = [
    {
        path: '/',
        element: React.createElement(BeforeEach, null, React.createElement(App)),
        meta: {
            auth: false
        },
        children: [
            {
                path: '',
                element: React.createElement(Home),
                meta: {
                    auth: false,
                }
            },
            {
                path: 'artist',
                element: React.createElement(Artist),
                meta: {
                    auth: false
                },
            },
            {
                path: 'mv',
                element: React.createElement(MV),
                meta: {
                    auth: false
                },
            },
            {
                path: 'rankList',
                element: React.createElement(RankList),
                meta: {
                    auth: false
                },
            },
            {
                path: 'mySetting',
                element: React.createElement(MySettng),
                meta: {
                    auth: true
                },
            },
            {
                path: 'notServer',
                element: React.createElement(NotServer),
                meta: {
                    auth: false
                },
            },
            {
                path: '*',
                element: React.createElement(NotFound),
                meta: {
                    auth: false
                },
            },
        ]
    },
    {
        path: '/myMusic',
        element: React.createElement(Suspense, {
            fallback: <Spin tip='Loading' size='large' style={{ margin: '20% 50%' }} />
        }, React.createElement(MyMusic)),
    },
    {
        path: '*',
        element: React.createElement(NotFound),
    },
];

const router = createBrowserRouter(routes);

export default router;