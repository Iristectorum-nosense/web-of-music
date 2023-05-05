import React from 'react';
import './HomeRank.scss';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';

export default function HomeRankComponent({ data = {} }) {

    const { handleSongClick, handleSingerClick } = useClickNavigate()

    return (
        <div className='home-rank'>
            <div>
                <a href='/rankList' >热歌榜</a>
                <hr style={{ border: '3px solid #fff' }} />
                <div className='home-rank-song'>
                    {
                        data.hot.map((song, index) => (
                            <div key={song.id}>
                                <div>
                                    <span>{index + 1}</span>
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }}>{song.name}</a>
                                </div>
                                <div>
                                    {
                                        song.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }} >{singer.name}</a>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <a href='/rankList?top=2'>新歌榜</a>
                <hr style={{ border: '3px solid #fff' }} />
                <div className='home-rank-song'>
                    {
                        data.new.map((song, index) => (
                            <div key={song.id}>
                                <div>
                                    <span>{index + 1}</span>
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }}>{song.name}</a>
                                </div>
                                <div>
                                    {
                                        song.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }} >{singer.name}</a>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <a href='/rankList?top=3'>中国榜</a>
                <hr style={{ border: '3px solid #fff' }} />
                <div className='home-rank-song'>
                    {
                        data.china.map((song, index) => (
                            <div key={song.id}>
                                <div>
                                    <span>{index + 1}</span>
                                    <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }}>{song.name}</a>
                                </div>
                                <div>
                                    {
                                        song.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }} >{singer.name}</a>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}