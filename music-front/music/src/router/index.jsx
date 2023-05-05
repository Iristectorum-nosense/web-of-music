import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import BeforeEach from "../components/BeforeEach/BeforeEach";
import { Spin } from 'antd';

const App = lazy(() => import('../App'));
const Home = lazy(() => import('../views/Home/Home'));
const Singer = lazy(() => import('../views/Singer/Singer'));
const MV = lazy(() => import('../views/MV/MV'));
const RankList = lazy(() => import('../views/RankList/RankList'));
const MySettng = lazy(() => import('../views/MySetting/MySettng'));
const SingerDetail = lazy(() => import('../views/SingerDetail/SingerDetail'));
const SingerDefault = lazy(() => import('../views/SingerDetail/SingerDefault/SingerDefault'));
const SingerSong = lazy(() => import('../views/SingerDetail/SingerSong/SingerSong'));
const SingerAlbum = lazy(() => import('../views/SingerDetail/SingerAlbum/SingerAlbum'));
const SingerMV = lazy(() => import('../views/SingerDetail/SingerMV/SingerMV'));
const AlbumDetail = lazy(() => import('../views/AlbumDetail/AlbumDetail'));
const SongDetail = lazy(() => import('../views/SongDetail/SongDetail'));

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
                path: 'singer',
                element: React.createElement(Singer),
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
                path: 'singerDetail/:id',
                element: React.createElement(SingerDetail),
                meta: {
                    auth: false
                },
                children: [
                    {
                        path: '',
                        element: React.createElement(SingerDefault),
                        meta: {
                            auth: false
                        }
                    },
                    {
                        path: 'song',
                        element: React.createElement(SingerSong),
                        meta: {
                            auth: false
                        }
                    },
                    {
                        path: 'album',
                        element: React.createElement(SingerAlbum),
                        meta: {
                            auth: false
                        }
                    },
                    {
                        path: 'mv',
                        element: React.createElement(SingerMV),
                        meta: {
                            auth: false
                        }
                    },
                ]
            },
            {
                path: 'albumDetail/:id',
                element: React.createElement(AlbumDetail),
                meta: {
                    auth: false
                },
            },
            {
                path: 'songDetail/:id',
                element: React.createElement(SongDetail),
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