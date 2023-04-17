import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './views/Common/Header/Header';
import Footer from './views/Common/Footer/Footer';
import './App.scss';

function App() {
    return (
        <div>
            <Header></Header>
            <Outlet />
            <Footer></Footer>
        </div>
    );
}

export default App;
