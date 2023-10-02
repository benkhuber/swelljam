import React from 'react';
import './App.css';
import BuoyData from './BuoyData';

function App() {
  return (
    <div>
      <h1>SwellJam</h1>
      <BuoyData currentStationId="46253" />
      <BuoyData currentStationId="46222" />
    </div>
  );
}

export default App;
