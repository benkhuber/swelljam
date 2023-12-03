import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

function AddSession() {
  const [rating, setRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setRating(newRating);
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
      <h4>How were the waves?</h4>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingChange(star)}
            style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
          >
            &#9733; {/* Unicode character for a star */}
          </span>
        ))}Absolutely Firing
      </div>
      <p>Selected Rating: {rating}</p>
      <h4>How was the size?</h4>
      <h4>How was the wind?</h4>
      <h4>How was the crowd?</h4>
    </div>
  );
}

export default AddSession;
