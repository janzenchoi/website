import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { Operations } from './components/Operations';
import { Memory } from './components/Memory';
import { Space } from './components/Space';
import { Snake } from './templates/Snake';
import { TypeRacer } from './templates/TypeRacer';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/home' element={<Dashboard />}/>
          <Route path='/operations' element={<Operations />}/>
          <Route path='/memory' element={<Memory />}/>
          <Route path='/space' element={<Space />}/>
          <Route path='/snake' element={<Snake />}/>
          <Route path='/typeracer' element={<TypeRacer />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
