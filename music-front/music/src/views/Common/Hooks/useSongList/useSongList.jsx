import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Button, Form, Input, Modal, message } from 'antd';
import { CustomerServiceOutlined, FolderAddOutlined, PlusSquareOutlined, BarsOutlined, PlayCircleOutlined, DeleteOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import PageComponent from '../usePagination/usePagination';
import { formatTime } from '../../../../utils/format';
import './useSongList.scss';
import { useLocation } from 'react-router-dom';
import { useClickNavigate } from '../useClickNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { createPlay, deleteLikeSong, deletePlaySong, getPlayList, setPlaySong } from '../../../../api/user';
import { getPlayListInfo } from '../../../../api/song';
import { addPlaySong, setPlayIndex } from '../../../../store/slices/user';
import { SongImgURL } from '../../../../utils/staticURL';

function useSongList(data, setReload, playSongId) {
    const [bulk, setBulk] = useState(false)
    const [optionAll, setOptionAll] = useState(false)
    const [options, setOptions] = useState(
        data.map((song) => ({
            id: song.id,
            option: false,
        }))
    )

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const pageIndex = parseInt(searchParams.get('index')) || 1
    const [playList, setPlayList] = useState([])
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [myPlayReload, setMyPlayReload] = useState(false)
    const [myPlayVisble, setMyPlayVisble] = useState(false)

    const loginInfos = useSelector((state) => state.login.loginInfos)
    const playInfoList = useSelector((state) => state.user.playList)
    const dispatch = useDispatch()

    const namePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,18}$/g

    useEffect(() => {
        setBulk(false)
    }, [location])

    useEffect(() => {
        setOptions(data.map((song) => ({
            id: song.id,
            option: false,
        })));
    }, [data])

    useEffect(() => {
        const allChecked = options.every((option) => option.option === true)
        setOptionAll(allChecked)
    }, [options])

    const token = cookie.load('jwtToken')

    useEffect(() => {
        if (token) {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email
            }
            getPlayList(payload).then((res) => {
                if (res.data.code === 200) setPlayList(res.data.myPlayList)
            }).catch(() => { })

            return () => {
                setMyPlayReload(false)
            }
        }
    }, [location, myPlayReload])

    const handlePlayClick = () => {
        const playIdList = []
        options.map((option) => {
            if (option.option === true) playIdList.push(option.id)
        })

        const newPlayIdList = playIdList.filter(id => !playInfoList.some(playInfo => playInfo.id === id))

        if (newPlayIdList.length === 0) {
            if (playIdList.length !== 0) dispatch(setPlayIndex(playInfoList.findIndex(playInfo => playInfo.id === playIdList[0])))
        } else {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playIdList: newPlayIdList
            }
            getPlayListInfo(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('添加成功')
                    dispatch(addPlaySong(res.data.playInfoList))
                } else if (res.data.code === 405) message.error(res.data.message)
            }).catch(() => { })
        }

        setOptionAll(false)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: false }
            })
        )
        setMyPlayVisble(false)
        setBulk(false)
    }

    const handleAllPlayClick = () => {
        const playIdList = []
        options.map((option) => { playIdList.push(option.id) })

        const newPlayIdList = playIdList.filter(id => !playInfoList.some(playInfo => playInfo.id === id))

        if (newPlayIdList.length === 0) {
            if (playIdList.length !== 0) dispatch(setPlayIndex(playInfoList.findIndex(playInfo => playInfo.id === playIdList[0])))
        } else {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playIdList: newPlayIdList
            }
            getPlayListInfo(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('添加成功')
                    dispatch(addPlaySong(res.data.playInfoList))
                } else if (res.data.code === 405) message.error(res.data.message)
            }).catch(() => { })
        }
    }

    const handleOnePlayClick = (id) => {
        const playIdList = []
        playIdList.push(id)

        const newPlayIdList = playIdList.filter(id => !playInfoList.some(playInfo => playInfo.id === id))
        if (newPlayIdList.length === 0) {
            if (playIdList.length !== 0) dispatch(setPlayIndex(playInfoList.findIndex(playInfo => playInfo.id === playIdList[0])))
        } else {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playIdList: newPlayIdList
            }
            console.log(newPlayIdList)
            getPlayListInfo(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('添加成功')
                    dispatch(addPlaySong(res.data.playInfoList))
                } else if (res.data.code === 405) message.error(res.data.message)
            }).catch(() => { })
        }
    }

    const handleFavorClick = () => {
        setMyPlayVisble(true)
    }

    const handleOneFavorClick = (id) => {
        setMyPlayVisble(true)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                if (option.id === id) {
                    return { ...option, option: !option.option }
                } else {
                    return option
                }
            })
        )
    }

    const handleBulkClick = () => {
        if (bulk) {
            //true表示进行批量操作,进入取消批量操作,显示批量操作
            setBulk(!bulk)
            setOptionAll(false)
            setOptions((prevOptions) =>
                prevOptions.map((option) => {
                    return { ...option, option: false }
                })
            )
        } else {
            //false表示没有批量操作,进入批量操作,显示取消批量操作
            setBulk(!bulk)
            setOptionAll(true)
            setOptions((prevOptions) =>
                prevOptions.map((option) => {
                    return { ...option, option: true }
                })
            )
        }
        setMyPlayVisble(false)
    }

    const handleOptionChange = (id) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                if (option.id === id) {
                    return { ...option, option: !option.option }
                } else {
                    return option
                }
            })
        )
    }

    const handleOptionAll = () => {
        setOptionAll(!optionAll)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: !optionAll }
            })
        )
    }

    const handleFavorPlay = (id) => {
        const songIdList = []
        options.map((option) => {
            if (option.option === true) songIdList.push(option.id)
        })
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            songIdList: songIdList,
            playId: id
        }
        setPlaySong(payload).then((res) => {
            if (res.data.code === 200) {
                message.success('收藏成功')
                setReload(true)
            } else if (res.data.code === 405) message.error(res.data.message)
        }).catch(() => { })

        setOptionAll(false)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: false }
            })
        )
        setMyPlayVisble(false)
        setBulk(false)
    }

    const handleDeleteClick = (id, type) => {
        switch (type) {
            case 'likeSong':
                let payloadLikeSong = {
                    userId: loginInfos.userId,
                    email: loginInfos.email,
                    songId: id
                }
                deleteLikeSong(payloadLikeSong).then((res) => {
                    if (res.data.code === 200) {
                        message.success('删除成功')
                        setReload(true)
                    }
                    else if (res.data.code === 405) message.error(res.data.message)
                    else message.error('删除失败,请一会儿重试')
                }).catch(() => { })
                break
            case 'playSong':
                let payloadPlaySong = {
                    userId: loginInfos.userId,
                    email: loginInfos.email,
                    songId: id,
                    playId: playSongId
                }
                deletePlaySong(payloadPlaySong).then((res) => {
                    if (res.data.code === 200) {
                        message.success('删除成功')
                        setReload(true)
                    }
                    else if (res.data.code === 405) message.error(res.data.message)
                    else message.error('删除失败,请一会儿重试')
                }).catch(() => { })
                break
            default: break;
        }
    }

    const handleCloseClcik = () => {
        setMyPlayVisble(false)
        setOptions((prevOptions) =>
            prevOptions.map((option) => {
                return { ...option, option: false }
            })
        )
        setBulk(false)
    }

    const handleCreateClick = () => {
        setVisible(true)
    }

    const modalCreate = (props) => {
        switch (props) {
            case 'open': setVisible(true); break;
            default:
            case 'close': setVisible(false); break;
        }
    }

    const handleCreate = (e) => {
        if (namePattern.test(e.playName)) {
            setLoading(true)
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playName: e.playName
            }
            createPlay(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('创建成功')
                    setVisible(false)
                    setMyPlayReload(true)
                }
                else if (res.data.code === 405) message.error(res.data.message)
                else message.error('创建失败,请一会儿重试')
            }).catch(() => { })
            setLoading(false)
        } else {
            message.error('请输入正确的歌单名')
        }
    }

    return {
        bulk, optionAll, options, pageIndex, playList, visible, loading, myPlayVisble,
        handlePlayClick, handleAllPlayClick, handleOnePlayClick, handleFavorClick, handleBulkClick,
        handleOptionChange, handleOptionAll, handleDeleteClick, handleCloseClcik, handleOneFavorClick, handleFavorPlay,
        handleCreateClick, modalCreate, handleCreate
    };
}


export default function SongListComponent({ haveOption = true, haveImg = true, haveDelete = true, haveIndex = true, data = [], pageNum = 0, setReload, type = 'likeSong', playSongId }) {
    //haveOption:是否需要按钮及批量操作
    //haveImg:是否显示歌曲图片
    //haveDelete:是否显示删除歌曲图标
    //haveIndex:是否需要分页

    const { bulk, optionAll, options, pageIndex, playList, visible, loading, myPlayVisble,
        handlePlayClick, handleAllPlayClick, handleOnePlayClick, handleFavorClick, handleBulkClick,
        handleOptionChange, handleOptionAll, handleDeleteClick, handleCloseClcik, handleOneFavorClick, handleFavorPlay,
        handleCreateClick, modalCreate, handleCreate
    } = useSongList(data, setReload, playSongId)


    const { handleSingerClick, handleSongClick } = useClickNavigate()

    const token = cookie.load('jwtToken')

    return (
        <>
            <div className='content'>
                {
                    haveOption ? (
                        <div className='content-button'>
                            {
                                bulk
                                    ? <Button onClick={handlePlayClick}><CustomerServiceOutlined />播放</Button>
                                    : <Button onClick={handleAllPlayClick}><CustomerServiceOutlined />播放全部</Button>
                            }
                            {
                                token && bulk ? <Button onClick={handleFavorClick}><FolderAddOutlined />收藏</Button> : null
                            }
                            <Button onClick={handleBulkClick}><BarsOutlined />{
                                bulk ? '取消批量操作' : '批量操作'
                            }</Button>
                        </div>
                    ) : null
                }
                <div className='content-list'>
                    {
                        haveOption ? (
                            <ul className='content-list-header'>
                                <li>{bulk && <input type='checkbox' id='0' checked={optionAll} onChange={handleOptionAll} />}</li>
                                <li>歌曲</li>
                                <li>歌手</li>
                                <li>时长</li>
                            </ul>
                        ) : null
                    }
                    <ul>
                        {
                            data.map((song, index) => (
                                <li key={song.id} className='content-list-item' >
                                    {
                                        haveOption ? (
                                            <span className='content-list-item-index'>
                                                {bulk && <input type='checkbox' id={song.id} checked={options.find((option) => option.id === song.id).option} onChange={() => handleOptionChange(song.id)} />}
                                                {(pageIndex - 1) * 10 + index + 1}
                                            </span>
                                        ) : (
                                            <span className='content-list-item-index'>
                                                {(pageIndex - 1) * 10 + index + 1}
                                            </span>
                                        )
                                    }
                                    <span>
                                        {
                                            haveImg
                                                ? <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }} ><img src={SongImgURL(song.url, song.id)} alt={song.name} loading='lazy' /></a>
                                                : null
                                        }
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleSongClick(song.id) }} >{song.name}</a>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleOnePlayClick(song.id) }}><PlayCircleOutlined /></a>
                                        {
                                            token && !bulk ? <a href='#' onClick={(e) => { e.preventDefault(); handleOneFavorClick(song.id) }}><PlusSquareOutlined /></a> : null
                                        }
                                        {
                                            haveDelete ? <a href='#' onClick={(e) => { e.preventDefault(); handleDeleteClick(song.id, type) }}><DeleteOutlined /></a> : null
                                        }
                                    </span>
                                    <span>
                                        {
                                            song.singers.map((singer) => (
                                                <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                    {singer.name}
                                                </a>
                                            ))
                                        }
                                    </span>
                                    <span>{formatTime(song.time)}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {
                    haveIndex && pageNum !== 0 ? <PageComponent pageNum={pageNum} /> : null
                }
            </div >
            <div className={myPlayVisble ? 'favor-content' : 'favor-null'}>
                <div>
                    <Button onClick={handleCreateClick}><PlusOutlined />创建歌单</Button>
                    <a href='#' onClick={(e) => {
                        e.preventDefault()
                        handleCloseClcik()
                    }}><CloseOutlined /></a>
                </div>
                <div>
                    {
                        playList.length !== 0
                            ? <>
                                {
                                    playList.map((play) => (
                                        <div key={play.id}>
                                            <a href='#' onClick={(e) => {
                                                e.preventDefault()
                                                handleFavorPlay(play.id)
                                            }}>{play.name}</a>
                                            <span>{`(${play.count})`}</span>
                                        </div>
                                    ))
                                }
                            </> : null
                    }
                </div>
            </div>
            <Modal
                open={visible} destroyOnClose
                onCancel={() => modalCreate('close')}
                footer={null}
            >
                <Form onFinish={(ev) => handleCreate(ev)}
                    style={{ margin: '5% 0 10% 0' }}
                >
                    <Form.Item name='playName' label='歌单名'
                        rules={[{ required: true, message: '请输入歌单名' }]} >
                        <Input placeholder='2~18位,不含特殊字符' />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' loading={loading} style={{ marginTop: '5%', width: '100%' }}>确认</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}