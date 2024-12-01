import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <header>
                <NavBar/>
            </header>

            <main className="container-md flex-grow-1 py-4">
                <Outlet/>
            </main>

            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default MainLayout;