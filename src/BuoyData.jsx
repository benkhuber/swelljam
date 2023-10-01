import React, { useState } from 'react'

const BuoyData = () => {
    const apiUrl = `http://localhost:3001/api/buoydata`
    const [data, setData] = useState([])

    const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const textData = await response.text();
          setData(textData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData()
      let firstWaveHeight = null

      const lines = data.toString().split('\n');

      for (const line of lines) {
        const values = line.trim().split(/\s+/);
        console.log(values) 
 
        if (values.length === 19) {
          const year = values[0];
          const month = values[1];
          const day = values[2];
          const hour = values[3];
          const minute = values[4];
          const windDirection = values[5];
          const windSpeed = values[6];
          const gustSpeed = values[7];
          const waveHeight = values[8];
          const dominantPeriod = values[9];
          const averagePeriod = values[10];
          const meanWaveDirection = values[11];
          const pressure = values[12];
          const airTemperature = values[13];
          const waterTemperature = values[14];
          const dewPoint = values[15];
          const visibility = values[16];
          const pressureTendency = values[17];
          const tide = values[18];
        
          if (waveHeight !== 'WVHT') {
            if (waveHeight !== 'm') {
                firstWaveHeight = parseFloat(waveHeight)
                break;
                }
            }
        }
    }

    console.log(firstWaveHeight)

  return (
    <div>{firstWaveHeight} m</div>
  )
}

export default BuoyData