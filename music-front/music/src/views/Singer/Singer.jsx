import React, { useCallback, useEffect, useRef, useState } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import './Singer.scss';
import TagComponent from '../Common/Hooks/useTag';
import { useLocation } from 'react-router-dom';
import { getSingerList } from '../../api/singer';
import { throttleNow } from '../../utils';

export default function Singer() {
    const tagDefs = [
        {
            param: 'alphabet',
            options: [
                { name: '全部', value: -1 },
                { name: 'A', value: 1 }, { name: 'B', value: 2 }, { name: 'C', value: 3 }, { name: 'D', value: 4 }, { name: 'E', value: 5 },
                { name: 'F', value: 6 }, { name: 'G', value: 7 }, { name: 'H', value: 8 }, { name: 'I', value: 9 }, { name: 'J', value: 10 },
                { name: 'K', value: 11 }, { name: 'L', value: 12 }, { name: 'M', value: 13 }, { name: 'N', value: 14 }, { name: 'O', value: 15 },
                { name: 'P', value: 16 }, { name: 'Q', value: 17 }, { name: 'R', value: 18 }, { name: 'S', value: 19 }, { name: 'T', value: 20 },
                { name: 'U', value: 21 }, { name: 'V', value: 22 }, { name: 'W', value: 23 }, { name: 'X', value: 24 }, { name: 'Y', value: 25 },
                { name: 'Z', value: 26 }
            ]
        },
        {
            param: 'area',
            options: [
                { name: '全部', value: -1 }, { name: '中国', value: 1 }, { name: '欧美', value: 2 }, { name: '日韩', value: 3 }
            ]
        },
        {
            param: 'gender',
            options: [
                { name: '全部', value: -1 }, { name: '男', value: 1 }, { name: '女', value: 2 }, { name: '组合', value: 3 }
            ]
        },
        {
            param: 'genre',
            options: [
                { name: '全部', value: -1 }, { name: '流行', value: 1 }, { name: '说唱', value: 2 }, { name: '其他', value: 3 }
            ]
        }
    ]

    const intialOption = {
        alphabet: { name: '全部', value: -1 },
        area: { name: '全部', value: -1 },
        gender: { name: '全部', value: -1 },
        genre: { name: '全部', value: -1 },
    }

    const styleDefs = {
        tag: 'singer-tag',
        list: 'singer-tag-list',
        item: 'singer-tag-item',
        itemSelected: 'singer-tag-item singer-tag-item-selected'
    }

    const SingerTag = <TagComponent intialOption={intialOption} tagDefs={tagDefs} styleDefs={styleDefs} />

    const location = useLocation()

    const [singerList, setSingerList] = useState([])
    const offsetRef = useRef(0)
    const bottomRef = useRef(null)
    const searchParams = new URLSearchParams(location.search)
    const limit = 20
    const offset = 1

    useEffect(() => {
        let payload = {
            alphabet: parseInt(searchParams.get('alphabet')) || intialOption.alphabet.value,
            area: parseInt(searchParams.get('area')) || intialOption.area.value,
            gender: parseInt(searchParams.get('gender')) || intialOption.gender.value,
            genre: parseInt(searchParams.get('genre')) || intialOption.genre.value,
            offset: offset,
            limit: limit
        }
        getSingerList(payload).then((res) => {
            if (res.data.code === 200) {
                setSingerList(res.data.singerList)
                if (res.data.singerList.length === limit) {
                    offsetRef.current = 1
                    offsetRef.current = offsetRef.current + 1
                }
            }
        }).catch(() => { })
    }, [location])

    const getDelayData = () => {
        let payload = {
            alphabet: parseInt(searchParams.get('alphabet')) || intialOption.alphabet.value,
            area: parseInt(searchParams.get('area')) || intialOption.area.value,
            gender: parseInt(searchParams.get('gender')) || intialOption.gender.value,
            genre: parseInt(searchParams.get('genre')) || intialOption.genre.value,
            offset: offsetRef.current,
            limit: limit
        }
        getSingerList(payload).then((res) => {
            if (res.data.code === 200) {
                setSingerList((list) => [...list, ...res.data.singerList])
                if (res.data.singerList.length === limit) {
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
    }, 5000)

    const handleScroll = useCallback(throttle, [location])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {SingerTag}
            <div className='singer-content'>
                {
                    singerList.map((singer) => (
                        <div key={singer.id} className='singer-content-item'>
                            <img className='singer-content-item-img' src={`http://localhost:8000${singer.url}/${singer.id}.png`}
                                alt={singer.name} loading='lazy' />
                            <a href='#' className='singer-content-item-font' onClick={(e) => { e.preventDefault() }}>{singer.name}</a>
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
