import React, { useEffect, useState } from 'react';

function RegionalForecast() {
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
  });

  const currentStationId = '46253';

  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;
  const spectralApiURL = `http://localhost:3001/api/buoydata/spectral/${currentStationId}`;
  const buoyStationsURL = 'http://localhost:3001/api/buoydata/allstations';

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

  const parseDominantSwellData = () => {
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
            };

            setCurrentConditions(newConditions);
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

    if (hours > 1) {
      return `${hours} hours, ${minutes} minutes ago`;
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

  useEffect(() => {
    fetchRawBuoyData();
    fetchRawSpectralBuoyData();
    fetchBuoyStations();
  }, []);

  useEffect(() => {
    parseAllStationRawData();
  }, [rawBuoyStations]);

  useEffect(() => {
    updateStationDisplay();
  }, [parsedBuoyStations]);

  useEffect(() => {
    parseDominantSwellData();
    console.log(currentConditions);
  }, [rawBuoyData, rawSpectralData]);

  return (
    <div>
      <h2 className="regionalForecastTitle">Southern California Regional Forecast</h2>
      <div>
        <h3>North OC</h3>
        <div className="surfHeightConditionsContainer">
          <div className="surfHeightDescriptor">{ populateSurfHeightDescription(currentConditions.significantHeight)}</div>
          <div className="surfInfoPane">
            <div className="surfHeightConditionsViewer">
              <div className="surfRatingColor">1</div>
              <div className="surfHeightContainer">
                <div className="surfHeight">{ calculateSurfHeight(currentConditions.significantHeight) }</div>
                <div className="surfRating">POOR</div>
              </div>
            </div>
            <div>Yessir</div>
          </div>
        </div>
      </div>
      <h3>{ currentConditions.currentStationName }</h3>
      <div>
        <p> { currentConditions.currentStationLat }, { currentConditions.currentStationLon }</p>
        <p>Last Reading: { calculateTimeSinceLastReading(currentConditions.localDate) }</p>
        <p> { currentConditions.significantHeight } m at { currentConditions.peakPeriod} seconds
          from {getSwellDirectionLabel(currentConditions.dominantSwellDirection)}
          ({currentConditions.dominantSwellDirection})
        </p>
      </div>
    </div>
  );
}

export default RegionalForecast;
