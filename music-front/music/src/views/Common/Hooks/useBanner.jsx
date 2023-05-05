import React, { useState } from 'react';
import './useBanner.scss';

function useBanner(bannerNum) {

    const bannerArray = Array.from({ length: bannerNum }, (_, i) => i + 1)

    const [index, setIndex] = useState(1)

    const handleDotClick = (i) => {
        setIndex(i)
    }

    const handlePrevClick = () => {
        if (index === 1) setIndex(bannerNum)
        else setIndex((index) => index - 1)
    }

    const handleNextClick = () => {
        if (index === bannerNum) setIndex(1)
        else setIndex((index) => index + 1)
    }

    return { index, bannerArray, handleDotClick, handlePrevClick, handleNextClick }
}

export default function BannerComponent({ bannerNum = 1, component: ContentComponent }) {

    const { index, bannerArray, handleDotClick, handlePrevClick, handleNextClick } = useBanner(bannerNum)

    return (
        <div className='banner'>
            <button className='slide-left' onClick={handlePrevClick} ></button>
            <button className='slide-right' onClick={handleNextClick} ></button>
            {
                React.cloneElement(ContentComponent, { index })
            }
            <div className='bottom'>
                {
                    bannerArray.map((i) => (
                        <a key={i} href='#'
                            className={index === i ? 'bottom-dot bottom-dot-selected' : 'bottom-dot'}
                            onClick={(e) => { e.preventDefault(); handleDotClick(i) }} />
                    ))
                }
            </div>
        </div>
    )
}
