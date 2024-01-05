import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-datepicker';
import axios from 'axios';
import Header from '../components/Header';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-datepicker/dist/react-datepicker.css';

function AddSession() {
  const [sessionData, setSessionData] = useState({
    selectedSpot: 'Huntington State Beach',
    primaryBuoyID: '46253',
    dateTimeSelect: new Date(),
    waveRating: 0,
    sizeRating: 0,
    windRating: 0,
    crowdRating: 0,
    primarySwellHeight: 0,
    primarySwellDirection: 0,
    primarySwellPeriod: 0,
    averageSwellPeriod: 0,
    buoyWaterTemperature: 0,
  });
  const [buoyData, setBuoyData] = useState([]);
  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const navigate = useNavigate();

  const parseBuoyData = (userDate) => {
    const dateObject = new Date(userDate);
    const utcDateString = dateObject.toISOString();
    const utcDate = utcDateString.slice(0, 10);
    const utcTime = utcDateString.slice(11, 16);

    const lines = buoyData.toString().split('\n');
    let closestLine = null;
    let closestTimeDifference = Infinity;
    let swellHeight = 0;
    let swellDirection = 0;
    let swellPeriod = 0;
    let avgPeriod = 0;
    let waterTemp = 0;

    lines.forEach((line) => {
      const values = line.trim().split(/\s+/);

      if (values.length === 19) {
        const year = values[0];
        const month = values[1];
        const day = values[2];
        const hour = values[3];
        const minute = values[4];
        const waveHeight = values[8];
        const dominantPeriod = values[9];
        const averagePeriod = values[10];
        const meanWaveDirection = values[11];
        const waterTemperature = values[14];

        if (`${year}-${month}-${day}` === utcDate) {
          const lineTime = `${hour}:${minute}`;

          const timeDifference = Math.abs(
            Date.parse(`2000-01-01T${lineTime}:00.000Z`) - Date.parse(`2000-01-01T${utcTime}:00.000Z`),
          );

          if (timeDifference < closestTimeDifference) {
            closestTimeDifference = timeDifference;
            closestLine = line;
            swellHeight = waveHeight;
            swellDirection = meanWaveDirection;
            swellPeriod = dominantPeriod;
            avgPeriod = averagePeriod;
            waterTemp = waterTemperature;
          }
        }
      }
    });

    if (closestLine) {
      setSessionData((prevSessionData) => ({
        ...prevSessionData,
        primarySwellHeight: swellHeight,
        primarySwellDirection: swellDirection,
        primarySwellPeriod: swellPeriod,
        averageSwellPeriod: avgPeriod,
        buoyWaterTemperature: waterTemp,

      }));
    }
  };

  useEffect(() => {
    parseBuoyData(sessionData.dateTimeSelect);
  }, [buoyData, sessionData.dateTimeSelect]);

  const fetchSwellData = async () => {
    const apiUrl = `http://localhost:3001/api/buoydata/realtime/${sessionData.primaryBuoyID}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      setBuoyData(textData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  fetchSwellData();

  const handleSpotChange = (e) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      selectedSpot: e.target.value,
    }));
  };

  const handleDateTimeSelect = (date) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      dateTimeSelect: date,
    }));
  };

  const handleWaveRatingChange = (newRating) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      waveRating: newRating,
    }));
  };

  const handleSizeRatingChange = (newRating) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      sizeRating: newRating,
    }));
  };

  const handleWindRatingChange = (newRating) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      windRating: newRating,
    }));
  };

  const handleCrowdRatingChange = (newRating) => {
    setSessionData((prevSessionData) => ({
      ...prevSessionData,
      crowdRating: newRating,
    }));
  };

  const handleSubmitSession = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/addSession', sessionData);
      console.log('Data added successfully:', response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  useEffect(() => {
    const selectElement = document.getElementById('selectSpotMenu');
    selectElement.innerHTML = '';
    const surfSpots = [
      {
        spotName: 'Huntington State Beach',
        mainBuoyStationId: '46253',
      },
      {
        spotName: 'Newport Upper Jetties',
        mainBuoyStationId: '46253',
      },
      {
        spotName: 'T-Street',
        mainBuoyStationId: '46253',
      },
      {
        spotName: 'Upper Trestles',
        mainBuoyStationId: '46253',
      },
    ];

    surfSpots.forEach((spot) => {
      const optionElement = document.createElement('option');
      optionElement.value = spot.spotName;
      optionElement.textContent = spot.spotName;
      selectElement.appendChild(optionElement);
    });
  }, []);

  return (
    <div>
      <Header />
      <h2>Add Session</h2>

      <form>
        <div>
          <label htmlFor="selectSpotMenu">Select Spot:</label>
          <select
            id="selectSpotMenu"
            onChange={handleSpotChange}
            value={sessionData.selectedSpot}
            aria-label="Select a spot"
          />
        </div>

        <div>
          <label htmlFor="sessionDateTime">When did you paddle out?</label>
          <DatePicker
            id="sessionDateTime"
            selected={sessionData.dateTimeSelect}
            onChange={handleDateTimeSelect}
            showIcon
            showTimeSelect
            dateFormat="MM/dd/yyyy h:mm aa"
            timeCaption="Time"
            className="datepicker"
          />
        </div>

        <h4>How were the waves? (1 = Terrible, 10 = Firing)</h4>
        <div>
          {ratingScale.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleWaveRatingChange(number)}
              className="ratingButton"
              style={{
                backgroundColor: number <= sessionData.waveRating ? 'purple' : 'gray',
              }}
            >
              {number}
            </button>
          ))}
        </div>

        <h4>How was the size? (1 = Tiny or Too Big, 10 = Perfect Size)</h4>
        <div>
          {ratingScale.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleSizeRatingChange(number)}
              className="ratingButton"
              style={{
                backgroundColor: number <= sessionData.sizeRating ? 'purple' : 'gray',
              }}
            >
              {number}
            </button>
          ))}
        </div>

        <h4>How was the wind? (1 = Not for you, 10 = Chef&apos;s kiss)</h4>
        <div>
          {ratingScale.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleWindRatingChange(number)}
              className="ratingButton"
              style={{
                backgroundColor: number <= sessionData.windRating ? 'purple' : 'gray',
              }}
            >
              {number}
            </button>
          ))}
        </div>

        <h4>How was the crowd? (1 = Mellow, 10 = Zoo)</h4>
        <div>
          {ratingScale.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleCrowdRatingChange(number)}
              className="ratingButton"
              style={{
                backgroundColor: number <= sessionData.crowdRating ? 'purple' : 'gray',
              }}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmitSession}
        >Add Data
        </button>
      </form>
    </div>
  );
}

export default AddSession;
