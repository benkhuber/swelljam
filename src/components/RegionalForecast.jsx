import React, { useEffect, useState } from 'react';
import WindArrow from '../icons/WindArrow';

function RegionalForecast({
  region, stationID, windLat, windLong,
}) {
  const [rawBuoyData, setRawBuoyData] = useState([]);
  const [rawSpectralData, setRawSpectralData] = useState([]);
  const [rawBuoyStations, setRawBuoyStations] = useState([]);
  const [parsedBuoyStations, setParsedBuoyStations] = useState([]);
  const [currentConditions, setCurrentConditions] = useState({
    localDate: 'No Data',
    currentStationName: 'Not Available',
    currentStationLat: 'N/A',
    currentStationLon: 'N/A',
    significantHeight: 'No Data',
    dominantSwellDirection: 'No Data',
    peakPeriod: 'No Data',
    currentWaterTemperature: 'No Data',
    individualSwellHeight: 'No Data',
    individualSwellPeriod: 'No Data',
    individualSwellDirection: 'No Data',
    windSwellHeight: 'No Data',
    windSwellPeriod: 'No Data',
    windSwellDirection: 'No Data',
    surfRating: 'No Data',
  });
  const [currentWeatherConditions, setCurrentWeatherConditions] = useState({
    temperature: 'No Data',
    windSpeed: 'No Data',
    windDirection: 'No Data',
    windGustSpeed: 'No Data',
    weatherCode: 'No Data',
  });

  const currentStationId = stationID;

  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;
  const spectralApiURL = `http://localhost:3001/api/buoydata/spectral/${currentStationId}`;
  const buoyStationsURL = 'http://localhost:3001/api/buoydata/allstations';
  const windConditionsURL = `https://api.open-meteo.com/v1/forecast?latitude=${windLat}&longitude=${windLong}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=kn&timezone=America%2FLos_Angeles&forecast_days=1`;

  const fetchRawBuoyData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      setRawBuoyData(textData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const fetchRawSpectralBuoyData = async () => {
    try {
      const spectralResponse = await fetch(spectralApiURL);
      if (!spectralResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const spectralData = await spectralResponse.text();
      setRawSpectralData(spectralData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const fetchBuoyStations = async () => {
    try {
      const allBuoyStationsResponse = await fetch(buoyStationsURL);
      if (!allBuoyStationsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const allBuoyStationsRawData = await allBuoyStationsResponse.text();
      setRawBuoyStations(allBuoyStationsRawData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const fetchWindData = async () => {
    try {
      const windResponse = await fetch(windConditionsURL);
      if (!windResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await windResponse.json();

      setCurrentWeatherConditions({
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        windGustSpeed: data.current.wind_gusts_10m,
        weatherCode: data.current.weather_code,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const parseAllStationRawData = () => {
    const xmlString = rawBuoyStations;
    const buoyStations = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const stations = xmlDoc.getElementsByTagName('station');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const id = station.getAttribute('id');
      const lat = station.getAttribute('lat');
      const lon = station.getAttribute('lon');
      const name = station.getAttribute('name');
      const type = station.getAttribute('type');

      if (type === 'buoy' && name.includes(', CA')) {
        const parsedBuoyStation = {
          id,
          lat,
          lon,
          name,
        };
        buoyStations.push(parsedBuoyStation);
      }
    }
    setParsedBuoyStations(buoyStations);
  };

  const calculateSurfRating = (swellPeriod, waveHeight, currentWind, windDirection) => {
    if (currentWind > 10 && windDirection > 120) {
      return 'CHOPPY';
    }
    if (currentWind > 10 && windDirection > 0 && windDirection < 120) {
      return 'CLEAN';
    }
    if (swellPeriod > 13 && waveHeight > 1.8) {
      return 'CLEAN';
    } if (swellPeriod > 9 && waveHeight > 0.75) {
      return 'FAIR';
    }
    return 'CHOPPY';
  };

  const parseDominantSwellData = (currentWind, windDirection) => {
    const lines = rawBuoyData.toString().split('\n');

    for (const line of lines) {
      const values = line.trim().split(/\s+/);

      if (values.length === 19) {
        const year = values[0];
        const month = values[1];
        const day = values[2];
        const hour = values[3];
        const minute = values[4];
        const waveHeight = values[8];
        const meanWaveDirection = values[11];
        const dominantPeriod = values[9];
        const waterTemperature = values[14];

        if (waveHeight !== 'WVHT') {
          if (waveHeight !== 'm') {
            const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
            const newLocalDate = new Date(utcDate);

            const newConditions = {
              ...currentConditions,
              localDate: newLocalDate,
              currentWaterTemperature: waterTemperature,
              dominantSwellDirection: meanWaveDirection,
              significantHeight: waveHeight,
              peakPeriod: dominantPeriod,
              surfRating: calculateSurfRating(
                dominantPeriod,
                waveHeight,
                currentWind,
                windDirection,
              ),
            };

            setCurrentConditions(newConditions);
            break;
          }
        }
      }
    }
  };

  const parseSpectralSwellData = () => {
    const lines = rawSpectralData.toString().split('\n');

    for (const line of lines) {
      const values = line.trim().split(/\s+/);

      if (values.length === 15) {
        const swellHeight = values[6];
        const swellPeriod = values[7];
        const windWaveHeight = values[8];
        const windWavePeriod = values[9];
        const swellDirection = values[10];
        const windWaveDirection = values[11];

        if (swellHeight !== 'SwH') {
          if (swellHeight !== 'm') {
            currentConditions.individualSwellHeight = swellHeight;
            currentConditions.individualSwellPeriod = swellPeriod;
            currentConditions.individualSwellDirection = swellDirection;
            currentConditions.windSwellHeight = windWaveHeight;
            currentConditions.windSwellPeriod = windWavePeriod;
            currentConditions.windSwellDirection = windWaveDirection;
            break;
          }
        }
      }
    }
  };

  const updateStationDisplay = () => {
    const selectedStation = parsedBuoyStations.find((station) => station.id === currentStationId);
    if (selectedStation) {
      const updatedConditions = {
        ...currentConditions,
        currentStationName: selectedStation.name,
        currentStationLat: selectedStation.lat,
        currentStationLon: selectedStation.lon,
      };
      setCurrentConditions(updatedConditions);
    }
  };

  const calculateTimeSinceLastReading = (dateInput) => {
    const dateAtReading = new Date(dateInput);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - dateAtReading.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 1 && minutes < 2) {
      return `${hours} hours ago`;
    }
    if (hours > 1 && minutes >= 2) {
      return `${hours} hours, ${minutes} minutes ago`;
    }
    if (hours > 0 && minutes < 2) {
      return `${hours} hour ago`;
    }
    if (hours > 0) {
      return `${hours} hour, ${minutes} minutes ago`;
    }
    return `${minutes} minutes ago`;
  };

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

  const calculateSurfHeight = (swellHeight) => {
    if (Number.isNaN(parseInt(swellHeight, 10))) {
      return 'No Data Available';
    }

    const meterToFeetConversion = 3.28;
    const convertedSwellHeight = Math.floor(swellHeight * meterToFeetConversion);
    const convertedSwellHeightBottom = convertedSwellHeight - 1;
    const convertedSwellHeightTop = convertedSwellHeight + 1;

    return `${convertedSwellHeightBottom} - ${convertedSwellHeightTop} ft`;
  };

  const populateSurfHeightDescription = (swellHeight) => {
    const meterToFeetConversion = 3.28;
    const convertedSwellHeight = Math.floor(swellHeight * meterToFeetConversion);
    let stringOutput = '';

    if (convertedSwellHeight >= 7) {
      stringOutput = 'Overhead to well overhead';
    } else if (convertedSwellHeight >= 5 && convertedSwellHeight < 7) {
      stringOutput = 'Shoulder high to overhead';
    } else if (convertedSwellHeight >= 3 && convertedSwellHeight < 5) {
      stringOutput = 'Waist to chest high';
    } else if (convertedSwellHeight >= 1 && convertedSwellHeight < 3) {
      stringOutput = 'Ankle to waist high';
    } else {
      stringOutput = 'Flat';
    }

    return stringOutput;
  };

  const getSurfRatingColorClass = (surfRating) => {
    if (surfRating === 'CLEAN') {
      return 'surfRatingColorGood';
    }
    if (surfRating === 'FAIR') {
      return 'surfRatingColorFair';
    }
    return 'surfRatingColorPoor';
  };

  const getWindDescriptor = (degrees) => {
    if (degrees >= 0 && degrees < 120) {
      return 'Offshore wind';
    } if (degrees >= 120 && degrees < 210) {
      return 'Sideshore wind';
    } if (degrees >= 210 && degrees < 330) {
      return 'Onshore wind';
    }
    return 'Offshore wind';
  };

  const getWindRating = (windSpeed, windDirection) => {
    const windDescription = getWindDescriptor(windDirection);
    if (windDescription === 'Offshore wind') {
      return 'windRatingGood';
    }
    if (windSpeed >= 5 && windDescription === 'Onshore wind') {
      return 'windRatingPoor';
    }
    return 'windRatingFair';
  };

  useEffect(() => {
    fetchRawBuoyData();
    fetchRawSpectralBuoyData();
    fetchBuoyStations();
    fetchWindData();
  }, []);

  useEffect(() => {
    parseAllStationRawData();
  }, [rawBuoyStations]);

  useEffect(() => {
    updateStationDisplay();
  }, [parsedBuoyStations]);

  useEffect(() => {
    parseDominantSwellData(
      currentWeatherConditions.windSpeed,
      currentWeatherConditions.windDirection,
    );
    updateStationDisplay();
  }, [rawBuoyData]);

  useEffect(() => {
    parseSpectralSwellData();
    updateStationDisplay();
  }, [rawSpectralData]);

  useEffect(() => {
  }, [currentWeatherConditions]);

  return (
    <div>
      <h3>{ region }</h3>
      <div className="conditionsContainer">
        <div className="surfHeightConditionsContainer">
          <div className="surfHeightDescriptor">{ populateSurfHeightDescription(currentConditions.significantHeight)}</div>
          <div className="surfInfoPane">
            <div className="surfHeightConditionsViewer">
              <div className={`surfRatingColor ${getSurfRatingColorClass(currentConditions.surfRating)}`} />
              <div className="surfHeightContainer">
                <div className="surfHeight">{ calculateSurfHeight(currentConditions.significantHeight) }</div>
                <div className="surfRating">{ currentConditions.surfRating }</div>
                <div>{ calculateTimeSinceLastReading(
                  currentConditions.localDate,
                )} ({currentConditions.currentStationName})
                </div>
              </div>
            </div>
            <div className="buoyReadings">
              <div className="primaryBuoyReading">{ (currentConditions.significantHeight * 3.28).toFixed(1) } ft at { Math.round(currentConditions.peakPeriod)} s / {getSwellDirectionLabel(currentConditions.dominantSwellDirection)} ({currentConditions.dominantSwellDirection}&deg;)
              </div>
              <div className="individualBuoyReading">{ (currentConditions.individualSwellHeight * 3.28).toFixed(1) } ft at { Math.round(currentConditions.individualSwellPeriod) } s / {currentConditions.individualSwellDirection}
              </div>
              <div className="windBuoyReading">{ (currentConditions.windSwellHeight * 3.28).toFixed(1) } ft at { Math.round(currentConditions.windSwellPeriod) } s / {currentConditions.windSwellDirection}
              </div>
            </div>
          </div>
        </div>
        <div className="currentWeatherContainer">
          <div className="windContainer">
            <div className="windDescriptorDisplay">{getWindDescriptor(currentWeatherConditions.windDirection)}</div>
            <div className="windSpeedDisplay">{Math.round(currentWeatherConditions.windSpeed)} mph {getSwellDirectionLabel(currentWeatherConditions.windDirection)}</div>
            <div className="windGustDisplay">{Math.round(currentWeatherConditions.windGustSpeed)} mph gusts</div>
          </div>
          <div className={`windArrow ${getWindRating(currentWeatherConditions.windSpeed, currentWeatherConditions.windDirection)}`}><WindArrow windDirection={currentWeatherConditions.windDirection} /></div>
        </div>
        <div>
          { Math.round(currentWeatherConditions.temperature) } F
        </div>
      </div>
    </div>
  /* <h3>{ currentConditions.currentStationName }</h3>
      <div>
        <p> { currentConditions.currentStationLat }, { currentConditions.currentStationLon }</p>
        <p>Last Reading: { calculateTimeSinceLastReading(currentConditions.localDate) }</p>
        <p> { currentConditions.significantHeight } m at { currentConditions.peakPeriod} seconds
          from {getSwellDirectionLabel(currentConditions.dominantSwellDirection)}
          ({currentConditions.dominantSwellDirection})
        </p>
      </div> */
  );
}

export default RegionalForecast;
