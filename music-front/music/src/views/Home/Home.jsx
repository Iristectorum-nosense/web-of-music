import React, { useEffect, useState } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import { useLocation } from 'react-router-dom';
import BannerComponent from '../Common/Hooks/useBanner/useBanner';
import { getHome } from '../../api/home';
import './Home.scss';
import HomeAlbumComponent from './HomeAlbum/HomeAlbum';
import HomeMVComponent from './HomeMV/HomeMV';
import HomeRankComponent from './HomeRank/HomeRank';

export default function Home() {

    const location = useLocation()
    const [homeInfo, setHomeInfo] = useState([])

    useEffect(() => {
        getHome().then((res) => {
            if (res.data.code === 200) {
                setHomeInfo(res.data.home)
            }
        }).catch(() => { })
    }, [location])

    const HomeAlbum = <HomeAlbumComponent data={homeInfo.albumList} />
    const AlbumBanner = <BannerComponent bannerNum={4} component={HomeAlbum} />
    const HomeMV = <HomeMVComponent data={homeInfo.mvList} />
    const MVBanner = <BannerComponent bannerNum={5} component={HomeMV} />
    const HomeRank = <HomeRankComponent data={homeInfo.rankObj} />

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {
                homeInfo.length !== 0
                    ? <>
                        <div className='home-title'>新碟首发</div>
                        {AlbumBanner}
                        <div className='home-title'>排行榜</div>
                        {HomeRank}
                        <div className='home-title'>精彩MV</div>
                        {MVBanner}
                    </>
                    : <div style={{ margin: '500px', display: 'flex', justifyContent: 'center' }}>加载中...</div>
            }
        </div>
    )
}
