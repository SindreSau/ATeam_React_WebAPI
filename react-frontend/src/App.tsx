import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainLayout from './components/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CardPage from './pages/CardPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />} >
          <Route index element={<CardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
