/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';

function App() {
  const currentStationId = '46253';
  const [data, setData] = useState([]);
  const [spectralData, setSpectralData] = useState([]);
  // API URL for current conditions, includes dominant swell data
  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;
  // API URL for spectral conditions, includes individual swell data
  const spectralApiUrl = `http://localhost:3001/api/buoydata/spectral/${currentStationId}`;

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const spectralResponse = await (fetch(spectralApiUrl));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (!spectralResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      const spectralTextData = await spectralResponse.text();
      setData(textData);
      setSpectralData(spectralTextData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inputs the swell direction as a param and outputs a cardinal description.
  const getSwellDirectionLabel = (degrees) => {
    if (degrees >= 30 && degrees < 60) {
      return 'NE';
    } if (degrees >= 60 && degrees < 120) {
      return 'E';
    } if (degrees >= 120 && degrees < 150) {
      return 'SE';
    } if (degrees >= 150 && degrees < 210) {
      return 'S';
    } if (degrees >= 210 && degrees < 240) {
      return 'SW';
    } if (degrees >= 240 && degrees < 300) {
      return 'W';
    } if (degrees >= 300 && degrees < 330) {
      return 'NW';
    }
    return 'N';
  };

  // Initializes current conditions object with placeholder values. API request will update values.
  const currentConditions = {
    significantHeight: 'No Data',
    dominantSwellDirection: 'No Data',
    peakPeriod: 'No Data',
    currentWaterTemperature: 'No Data',
  };

  function parseDominantSwellData() {
  // API request returns a text file. Splits the text into lines based off line breaks
    const lines = data.toString().split('\n');

    // Loops through lines and splits at white space.
    for (const line of lines) {
      const values = line.trim().split(/\s+/);

      // Length checks that all columns are present
      if (values.length === 19) {
        const waveHeight = values[8];
        const meanWaveDirection = values[11];
        const dominantPeriod = values[9];
        const waterTemperature = values[14];

        // Checks to see if waveHeight is a header value. Once it reaches numerical value, the
        // current conditions values are updated with numeric values.
        if (waveHeight !== 'WVHT') {
          if (waveHeight !== 'm') {
            if (waveHeight === 'MM') {
              currentConditions.significantHeight = 'No Data';
            } else {
              currentConditions.significantHeight = `${(parseFloat(waveHeight) * 3.28084).toFixed(1)} ft`;
            }
            if (meanWaveDirection === 'MM') {
              currentConditions.dominantSwellDirection = 'No Data';
            } else {
              currentConditions.dominantSwellDirection = `${getSwellDirectionLabel(parseFloat(meanWaveDirection))} (${parseFloat(meanWaveDirection)}°)`;
            }
            if (dominantPeriod === 'MM') {
              currentConditions.peakPeriod = 'No Data';
            } else {
              currentConditions.peakPeriod = `${parseFloat(dominantPeriod)} s`;
            }
            if (waterTemperature === 'MM') {
              currentConditions.waterTemperature = 'No Data';
            } else {
              currentConditions.currentWaterTemperature = `${(parseFloat(waterTemperature) * (9 / 5) + 32).toFixed(0)}°F`;
            }
            break;
          }
        }
      }
    }
  }

  parseDominantSwellData();

  return (
    <div>
      <h1>SwellJam</h1>
      <div className="dataGrid">
        <Card value={currentConditions.significantHeight} description="Significant Height" />
        <Card value={currentConditions.peakPeriod} description="Peak Period" />
        <Card value={currentConditions.dominantSwellDirection} description="Mean Direction" />
        <Card value={currentConditions.currentWaterTemperature} description="Water Temperature" />
      </div>
    </div>
  );
}

export default App;
