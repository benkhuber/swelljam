import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

function AddSession() {
  const [waveRating, setWaveRating] = useState(0);
  const [sizeRating, setSizeRating] = useState(0);
  const [windRating, setWindRating] = useState(0);

  const handleWaveRatingChange = (newRating) => {
    setWaveRating(newRating);
  };

  const handleSizeRatingChange = (newRating) => {
    setSizeRating(newRating);
  };

  const handleWindRatingChange = (newRating) => {
    setWindRating(newRating);
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
      <h4>Select Spot:</h4>
      <select id="selectSpotMenu" />
      <h4>What day did you paddle out?</h4>
      <h4>When did you paddle out?</h4>
      <h4>How were the waves? (1 = Terrible, 10 = Firing)</h4>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
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

      <h4>How was the size?</h4>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
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
      <h4>How was the wind?</h4>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
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

      <h4>How was the crowd?</h4>

      <button
        type="button"
      >
        Add Session
      </button>
    </div>
  );
}

export default AddSession;
