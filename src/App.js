
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import MapPage from './Components/MapPage';
import FormPage from './Components/FormPage';
import ManagerPage from './Components/ManagerPage';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </div>
  );
}

export default App;
