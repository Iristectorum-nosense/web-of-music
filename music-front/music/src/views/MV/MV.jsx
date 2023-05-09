import React, { useCallback, useEffect, useRef, useState } from 'react';
import TagComponent from '../Common/Hooks/useTag';
import SubNav from '../Common/Header/SubNav/SubNav';
import './MV.scss';
import { useLocation } from 'react-router-dom';
import { getMVList } from '../../api/mv';
import { throttleNow } from '../../utils/throttle';
import { formatPublish } from '../../utils/format';
import { VideoCameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { MVImgURL } from '../../utils/staticURL';

export default function MV() {
    const tagDefs = [
        {
            param: 'version',
            options: [
                { name: '全部', value: -1 }, { name: 'MV', value: 1 }, { name: '现场', value: 2 }
            ]
        },
        {
            param: 'order',
            options: [
                { name: '最新', value: 1 }, { name: '最热', value: 2 }
            ]
        }
    ]

    const initialOption = {
        version: { name: '全部', value: -1 },
        order: { name: '最新', value: 1 }
    }

    const styleDefs = {
        tag: 'mv-tag',
        list: 'mv-tag-list',
        item: 'mv-tag-item',
        itemSelected: 'mv-tag-item mv-tag-item-selected'
    }

    const SingerTag = <TagComponent initialOption={initialOption} tagDefs={tagDefs} styleDefs={styleDefs} />

    const location = useLocation()

    const [mvList, setMVList] = useState([])
    const offsetRef = useRef(0)
    const bottomRef = useRef(null)
    const searchParams = new URLSearchParams(location.search)
    const limit = 8
    const offset = 1

    useEffect(() => {
        let payload = {
            version: parseInt(searchParams.get('version')) || initialOption.version.value,
            order: parseInt(searchParams.get('order')) || initialOption.order.value,
            offset: offset,
            limit: limit
        }
        getMVList(payload).then((res) => {
            if (res.data.code === 200) {
                setMVList(res.data.mvList)
                if (res.data.mvList.length === limit) {
                    offsetRef.current = 1
                    offsetRef.current = offsetRef.current + 1
                }
            }
        }).catch(() => { })
    }, [location])

    const getDelayData = () => {
        let payload = {
            version: parseInt(searchParams.get('version')) || initialOption.version.value,
            order: parseInt(searchParams.get('order')) || initialOption.order.value,
            offset: offsetRef.current,
            limit: limit
        }
        getMVList(payload).then((res) => {
            if (res.data.code === 200) {
                setMVList((list) => [...list, ...res.data.mvList])
                if (res.data.mvList.length === limit) {
                    offsetRef.current = offsetRef.current + 1
                } else {
                    offsetRef.current = 0
                }
            }
        }).catch(() => { })
    }

    const throttle = throttleNow(() => {
        if (bottomRef.current && bottomRef.current.getBoundingClientRect().bottom < window.innerHeight && offsetRef.current !== 0) {
            getDelayData()
        }
    }, 3000)

    const handleScroll = useCallback(throttle, [location])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const { handleSingerClick, handleMVClick } = useClickNavigate()

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {SingerTag}
            <div className='mv-content'>
                {
                    mvList.map((mv) => (
                        <div key={mv.id} className='mv-content-item'>
                            <a href='#' className='mv-content-item-img' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }}>
                                <img src={MVImgURL(mv.url, mv.id)} alt={mv.name} loading='lazy' />
                                <span className='mask'><PlayCircleOutlined /></span>
                            </a>
                            <a href='#' className='mv-content-item-font' onClick={(e) => { e.preventDefault(); handleMVClick(mv.id) }}>{mv.name}</a>
                            <div className='mv-content-item-font' >
                                {
                                    mv.singers.map((singer) => (
                                        <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                            {singer.name}
                                        </a>
                                    ))
                                }
                            </div>
                            <div className='mv-content-item-font' >
                                <span><Space><VideoCameraOutlined />{mv.play_count}</Space></span>
                                <span>{formatPublish(mv.publish)}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                offsetRef.current === 0
                    ? <div className='loading'>到底了~</div>
                    : <div className='loading'>加载中...</div>
            }
            <div ref={bottomRef}></div>
        </div>
    )
}
