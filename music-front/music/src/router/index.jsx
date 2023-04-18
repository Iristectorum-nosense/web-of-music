import { createBrowserRouter } from "react-router-dom";
import React, { lazy, memo } from "react";
import BeforeEach from "../components/BeforeEach/BeforeEach";

const App = lazy(() => import('../App'));
const Home = lazy(() => import('../views/Home/Home'));
const User = lazy(() => import('../views/User/User'));
const Artist = lazy(() => import('../views/Artist/Artist'));
const MV = lazy(() => import('../views/MV/MV'));
const RankList = lazy(() => import('../views/RankList/RankList'));
const MyMusic = lazy(() => import('../views/MyMusic/MyMusic'));
const Exception = lazy(() => import('../views/Common/Exception/Exception'));
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
                path: 'user',
                element: React.createElement(User),
                meta: {
                    auth: true
                },
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
                    auth: true
                },
            },
            {
                path: 'exception',
                element: React.createElement(Exception),
                meta: {
                    auth: false
                },
            },
            {
                path: 'notFound',
                element: React.createElement(NotFound),
                meta: {
                    auth: false
                },
            },
            {
                path: 'notServer',
                element: React.createElement(NotServer),
                meta: {
                    auth: false
                },
            },
        ]
    },
    {
        path: '/myMusic',
        element: React.createElement(BeforeEach, null, React.createElement(MyMusic)),
        meta: {
            auth: true
        },
    },
];

const router = createBrowserRouter(routes);

export default router;