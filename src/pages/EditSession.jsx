import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';
import axios from 'axios';
import Header from '../components/Header';

function EditSession({ onDelete }) {
  const { state: { session } } = useLocation();
  const [sessionData, setSessionData] = useState({
    selectedSpot: session.selectedSpot,
    primaryBuoyID: session.primaryBuoyID,
    dateTimeSelect: parseISO(session.dateTimeSelect),
    waveRating: session.waveRating,
    sizeRating: session.sizeRating,
    windRating: session.windRating,
    crowdRating: session.crowdRating,
    primarySwellHeight: session.primarySwellHeight,
    primarySwellDirection: session.primarySwellDirection,
    primarySwellPeriod: session.primarySwellPeriod,
    averageSwellPeriod: session.averageSwellPeriod,
    buoyWaterTemperature: session.buoyWaterTemperature,
  });
  const [buoyData, setBuoyData] = useState([]);

  const navigate = useNavigate();
  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
      console.log(closestLine);
      console.log(swellHeight);
      console.log(swellDirection);
      console.log(swellPeriod);

      setSessionData((prevSessionData) => ({
        ...prevSessionData,
        primarySwellHeight: swellHeight,
        primarySwellDirection: swellDirection,
        primarySwellPeriod: swellPeriod,
        averageSwellPeriod: avgPeriod,
        buoyWaterTemperature: waterTemp,

      }));
    }
    console.log(sessionData);
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

  console.log(sessionData);

  const handleSubmitSession = async () => {
    try {
      console.log(session._id);
      console.log(sessionData);
      const response = await axios.put(
        `http://localhost:3001/api/updateSession/${session._id}`,
        sessionData,
      );
      console.log('Data updated successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await onDelete(session._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return (
    <div><Header />
      <h3>Edit Session</h3>
      <p>To be continued...</p>

      <form>
        <div>
          <label htmlFor="selectSpotMenu">Select Spot:</label>
          <select
            id="selectSpotMenu"
            onChange={handleSpotChange}
            value={sessionData.selectedSpot}
            aria-label="Select a spot"
          >
            {surfSpots.map((spot) => (
              <option key={spot.spotName} value={spot.spotName}>
                {spot.spotName}
              </option>
            ))}
          </select>
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
        >Submit Edits
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
        >Delete Session
        </button>
      </form>
    </div>
  );
}

export default EditSession;
