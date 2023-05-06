import React from 'react';
import './Search.scss';
import TagComponent from '../Common/Hooks/useTag';
import { useLocation } from 'react-router-dom';
import SearchSong from './SearchSong/SearchSong';
import SearchAlbum from './SeachAlbum/SearchAlbum';
import SearchMV from './SearchMV/SearchMV';

export default function Search() {

    const tagDefs = [
        {
            param: 'type',
            options: [
                { name: '单曲', value: 1 }, { name: '专辑', value: 2 }, { name: 'MV', value: 3 }
            ]
        }
    ]

    const initialOption = {
        type: { name: '单曲', value: 1 }
    }

    const styleDefs = {
        tag: 'search-tag',
        list: 'search-tag-list',
        item: 'search-tag-item',
        itemSelected: 'search-tag-item search-tag-item-selected'
    }

    const SearchTag = <TagComponent initialOption={initialOption} tagDefs={tagDefs} styleDefs={styleDefs} />

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const type = parseInt(searchParams.get('type')) || 1

    const SongList = <SearchSong />
    const AlbumList = <SearchAlbum />
    const MVList = <SearchMV />

    return (
        <div className='header-wrapper'>
            {SearchTag}
            <div className='search-content'>
                {
                    type === 1
                        ? <div className='search-content-song'>{SongList}</div>
                        : type === 2
                            ? <>{AlbumList}</>
                            : type === 3
                                ? <>{MVList}</>
                                : null
                }
            </div>
        </div>
    )
}
