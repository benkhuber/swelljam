/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

function Home() {
  const [mainBuoyData, setMainBuoyData] = useState([]);
  const [currentStationId, setCurrentStationId] = useState(['46253']);

  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;

  const fetchMainBuoyData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const textMainBouyData = await response.text();
      setMainBuoyData(textMainBouyData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchMainBuoyData();
  }, [currentStationId]);

  let firstWaveHeight = null;
  let wavePeriod = null;
  let waveDirection = null;
  let currentWaterTemp = null;
  let lastReadingDate = null;
  let lastReadingTime = null;

  const lines = mainBuoyData.toString().split('\n');

  for (const line of lines) {
    const values = line.trim().split(/\s+/);

    if (values.length === 19) {
      const year = values[0];
      const month = values[1];
      const day = values[2];
      const hour = values[3];
      const minute = values[4];
      // const windDirection = values[5];
      // const windSpeed = values[6];
      // const gustSpeed = values[7];
      const waveHeight = values[8];
      const dominantPeriod = values[9];
      // const averagePeriod = values[10];
      const meanWaveDirection = values[11];
      // const pressure = values[12];
      // const airTemperature = values[13];
      const waterTemperature = values[14];
      // const dewPoint = values[15];
      // const visibility = values[16];
      // const pressureTendency = values[17];
      // const tide = values[18];

      if (waveHeight !== 'WVHT') {
        if (waveHeight !== 'm') {
          firstWaveHeight = parseFloat(waveHeight);
          wavePeriod = parseFloat(dominantPeriod);
          waveDirection = parseFloat(meanWaveDirection);
          currentWaterTemp = parseFloat(waterTemperature);
          lastReadingDate = `${parseFloat(month)}-${parseFloat(day)}-${parseFloat(year)}`;
          lastReadingTime = `${parseFloat(hour - 7)}:${parseFloat(minute)}`;
          break;
        }
      }
    }
  }
  console.log(mainBuoyData);
  console.log(firstWaveHeight);

  return (
    <div>
      <Header />
      <p>{firstWaveHeight}</p>
    </div>
  );
}

export default Home;
