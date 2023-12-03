import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Header from '../components/Header';
import 'react-datepicker/dist/react-datepicker.css';

function AddSession() {
  const [selectedSpot, setSelectedSpot] = useState('Huntington State Beach');
  const [dateTimeSelect, setDateTimeSelect] = useState(new Date());
  const [waveRating, setWaveRating] = useState(0);
  const [sizeRating, setSizeRating] = useState(0);
  const [windRating, setWindRating] = useState(0);
  const [crowdRating, setCrowdRating] = useState(0);

  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSpotChange = (e) => {
    setSelectedSpot(e.target.value);
  };

  const handleDateTimeSelect = (date) => {
    setDateTimeSelect(date);
  };

  const handleWaveRatingChange = (newRating) => {
    setWaveRating(newRating);
  };

  const handleSizeRatingChange = (newRating) => {
    setSizeRating(newRating);
  };

  const handleWindRatingChange = (newRating) => {
    setWindRating(newRating);
  };

  const handleCrowdRatingChange = (newRating) => {
    setCrowdRating(newRating);
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

  console.log(selectedSpot);
  console.log(waveRating);
  console.log(sizeRating);
  console.log(windRating);
  console.log(crowdRating);
  console.log(dateTimeSelect);

  return (
    <div>
      <Header />
      <h2>Add Session</h2>
      <label htmlFor="selectSpotMenu">Select Spot:</label>
      <select
        id="selectSpotMenu"
        onChange={handleSpotChange}
        value={selectedSpot}
        aria-label="Select a spot"
      />

      <form>
        <label htmlFor="sessionDateTime">When did you paddle out?</label>
        <DatePicker
          id="sessionDateTime"
          selected={dateTimeSelect}
          onChange={handleDateTimeSelect}
          showIcon
          showTimeSelect
          dateFormat="MM/dd/yyyy h:mm aa"
          timeCaption="Time"
          className="datepicker"
        />

        <h4>How were the waves? (1 = Terrible, 10 = Firing)</h4>
        <div>
          {ratingScale.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleWaveRatingChange(number)}
              className="ratingButton"
              style={{
                backgroundColor: number <= waveRating ? 'purple' : 'gray',
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
                backgroundColor: number <= sizeRating ? 'purple' : 'gray',
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
                backgroundColor: number <= windRating ? 'purple' : 'gray',
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
                backgroundColor: number <= crowdRating ? 'purple' : 'gray',
              }}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          type="button"
        >
          Add Session
        </button>
      </form>
    </div>
  );
}

export default AddSession;
