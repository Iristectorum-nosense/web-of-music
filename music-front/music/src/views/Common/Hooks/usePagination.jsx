import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './usePagination.scss';
import { Input } from 'antd';

function usePagination(pageNum) {
    const navigate = useNavigate();
    const location = useLocation();

    const [curPage, setCurPage] = useState(1)
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        //以当前url更新page
        const searchParams = new URLSearchParams(location.search);
        setCurPage(parseInt(searchParams.get('index')) || 1)
    }, [location])

    const handleCurPageClick = (value) => {
        const searchParams = new URLSearchParams();
        searchParams.set('index', value);
        navigate({ search: searchParams.toString() });
    };

    const handlePrePageClick = (value) => {
        const searchParams = new URLSearchParams();
        searchParams.set('index', value - 1);
        navigate({ search: searchParams.toString() });
    };

    const handleNextPageClick = (value) => {
        const searchParams = new URLSearchParams();
        searchParams.set('index', value + 1);
        navigate({ search: searchParams.toString() });
    };

    const handleJumpClick = (value) => {
        if (!isNaN(parseInt(value))) {
            let v = parseInt(value);
            if (v < 1) {
                const searchParams = new URLSearchParams();
                searchParams.set('index', 1);
                navigate({ search: searchParams.toString() });
            } else if (v > pageNum) {
                const searchParams = new URLSearchParams();
                searchParams.set('index', pageNum);
                navigate({ search: searchParams.toString() });
            } else {
                const searchParams = new URLSearchParams();
                searchParams.set('index', v);
                navigate({ search: searchParams.toString() });
            }
            setInputValue('')
        } else {
            setInputValue('')
        }
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    return { curPage, inputValue, handleCurPageClick, handlePrePageClick, handleNextPageClick, handleInputChange, handleJumpClick };
}

export default function PageComponent({ pageNum = 0 }) {
    const { curPage, inputValue, handleCurPageClick, handlePrePageClick, handleNextPageClick, handleInputChange, handleJumpClick } = usePagination(pageNum)

    const pageArray = Array.from({ length: pageNum }, (_, i) => i + 1)

    const pageItem = (page) => {
        return (
            <a key={page} href='#'
                onClick={(e) => {
                    e.preventDefault()
                    handleCurPageClick(page)
                }}
                className={page === curPage ? 'page-item page-item-selected' : 'page-item'}
            >
                {page}
            </a>
        )
    }

    return (
        <div className='page-list'>
            <a href='#' className={curPage - 1 ? 'page-item' : 'page-item page-item-disabled'} onClick={(e) => { e.preventDefault(); handlePrePageClick(curPage); }}><LeftOutlined /></a>
            {
                pageArray.map((page) => {
                    if ((curPage - 2 < page && page < curPage + 2) || page === 1 || page === pageNum) {
                        return pageItem(page)
                    } else if (page === curPage - 2 || page === curPage + 2) {
                        return (
                            <span key={page} className='page-font'>...</span>
                        )
                    } else {
                        return null
                    }
                })
            }
            <a href='#' className={curPage < pageNum ? 'page-item' : 'page-item page-item-disabled'} onClick={(e) => { e.preventDefault(); handleNextPageClick(curPage); }}><RightOutlined /></a>
            <span className='page-font'>跳至</span>
            <span className='page-input'>
                <Input value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={(e) => handleJumpClick(e.target.value)} />
            </span>
            <span className='page-font'>页</span>
        </div>
    )
}