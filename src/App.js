import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      {/* <Sidebar /> */}
      {/* <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/pages' element={<Dashboard />}/>
          <Route path='/pages/typeracer' element={<TypeRacer />}/>
      </Routes> */}
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
