import React from 'react';
import Header from '../components/Header';
import BuoyData from '../BuoyData';

function Home() {
  return (
    <div>
      <Header />
      Home
      <BuoyData currentStationId="46253" />
    </div>
  );
}

export default Home;
