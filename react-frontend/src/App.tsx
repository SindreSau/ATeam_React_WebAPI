import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainLayout from './components/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />} >
          <Route index element={<>Her legges innhold på siden</>} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
