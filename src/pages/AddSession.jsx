import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-datepicker';
import axios from 'axios';
import Header from '../components/Header';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-datepicker/dist/react-datepicker.css';

function AddSession() {
  const [sessionData, setSessionData] = useState({
    selectedSpot: 'Huntington State Beach',
    dateTimeSelect: new Date(),
    waveRating: 0,
    sizeRating: 0,
    windRating: 0,
    crowdRating: 0,
  });

  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
          type="submit"
          onClick={handleSubmitSession}
        >Add Data
        </button>
      </form>
    </div>
  );
}

export default AddSession;
