/* eslint-disable no-restricted-syntax */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SpotForecast from './pages/SpotForecast';
import RegionalReport from './pages/RegionalReport';
import BuoyReport from './pages/BuoyReport';
import Map from './pages/Map';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/surfreport" element={<SpotForecast />} />
        <Route path="/regionalreport" element={<RegionalReport />} />
        <Route path="/map" element={<Map />} />
        <Route path="/buoyreport" element={<BuoyReport />} />
      </Routes>
    </Router>
  );
}

export default App;
