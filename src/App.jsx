/* eslint-disable no-restricted-syntax */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpotForecast from './pages/SpotForecast';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpotForecast />} />
        <Route path="/spotforecast" element={<SpotForecast />} />
      </Routes>
    </Router>
  );
}

export default App;
