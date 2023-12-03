/* eslint-disable no-restricted-syntax */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddSession from './pages/AddSession';
import SpotForecast from './pages/SpotForecast';
import Map from './pages/Map';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addsession" element={<AddSession />} />
        <Route path="/surfreport" element={<SpotForecast />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
