import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';
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

  const navigate = useNavigate();
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

  console.log(sessionData);

  const handleSubmitSession = () => {
    console.log('YES');
  };

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
