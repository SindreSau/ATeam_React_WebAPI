import React from 'react';
import './App.css';
import MainLayout from './components/MainLayout';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./pages/Home";
import Products from "./pages/Products";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path={'/products'} element={<Products/>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    );
}

export default App;
