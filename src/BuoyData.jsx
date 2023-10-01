import React, { useState, useEffect } from 'react'

const BuoyData = ( {currentStationId} ) => {
    const [data, setData] = useState([])
    const [swellData, setSwellData] = useState([])

    const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`
    const spectralApiURL = `http://localhost:3001/api/buoydata/spectral/${currentStationId}`

    console.log(apiUrl)
    console.log(spectralApiURL)
1
    const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          const spectralResponse = await fetch(spectralApiURL);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (!spectralResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const textData = await response.text();
          const spectralData = await spectralResponse.text();
          setData(textData);
          setSwellData(spectralData)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    

    useEffect(() => {
        fetchData()
        console.log('DATA FETCH')
    }, [currentStationId])

    let firstWaveHeight = null
    let wavePeriod = null
    let waveDirection = null
    let currentWaterTemp = null
    let lastReadingDate = null
    let lastReadingTime = null

    let spectralSwellDirection = null

    const spectralLines = swellData.toString().split('\n')

    for (const line of spectralLines) {
        const values = line.trim().split(/\s+/);

        if (values.length === 15) {
            const swellDirection = values[10]

            if (swellDirection !== 'SwD') {
                if (swellDirection !== '-') {
                    spectralSwellDirection = swellDirection
                    break;
                }
            }    
        }
    }

    const lines = data.toString().split('\n');
   
      for (const line of lines) {
        const values = line.trim().split(/\s+/);
 
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
                wavePeriod = parseFloat(dominantPeriod)
                waveDirection = parseFloat(meanWaveDirection)
                currentWaterTemp = parseFloat(waterTemperature)
                lastReadingDate = `${parseFloat(month)} / ${parseFloat(day)} / ${parseFloat(year)}`
                lastReadingTime = `${parseFloat(hour - 7)}:${parseFloat(minute)}`
                break;
                }
            }
        }
    }

    let waveHeightConvertedToFeet = (firstWaveHeight * 3.28084).toFixed(1)
    currentWaterTemp = (currentWaterTemp * (9/5) + 32).toFixed(0)

    const getSwellDirectionLabel = (degrees) => {
        if (degrees >= 30 && degrees < 60) {
          return 'NE';
        } else if (degrees >= 60 && degrees < 120) {
          return 'E';
        } else if (degrees >= 120 && degrees < 150) {
          return 'SE';
        } else if (degrees >= 150 && degrees < 210) {
          return 'S';
        } else if (degrees >= 210 && degrees < 240) {
          return 'SW';
        } else if (degrees >= 240 && degrees < 300) {
          return 'W';
        } else if (degrees >= 300 && degrees < 330) {
          return 'NW';
        } else {
          return 'N'; // For degrees between 330 and 30
        }
      };

  return (
    <div className='card'>
        <div>San Pedro Buoy</div>
        <div>Last Reading: {lastReadingDate} @ {lastReadingTime}</div>
        <div>Swell Height: {waveHeightConvertedToFeet} ft</div>
        <div>Dominant Period: {wavePeriod} s</div>
        <div>Swell Direction: {getSwellDirectionLabel(waveDirection)} @ {waveDirection} deg</div>
        <div>Water Temp: {currentWaterTemp} F</div>
        <div>{spectralSwellDirection}</div>
    </div>
  )
}

export default BuoyData