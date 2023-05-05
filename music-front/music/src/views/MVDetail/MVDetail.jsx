import React, { useEffect } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import { useLocation, useParams } from 'react-router-dom';

export default function MVDetail() {

    const { id } = useParams()
    const location = useLocation()

    useEffect(() => {

    }, [location])

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {id}
        </div>
    )
}
