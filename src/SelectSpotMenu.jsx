import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectSpotMenu({ onSelectedSpotChange }) {
  const [data, setData] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getData');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleStationChange = (e) => {
    const newSelectedSpotId = e.target.value;
    setSelectedStationId(newSelectedSpotId);
    onSelectedSpotChange(newSelectedSpotId);
  };

  return (
    <div>
      <div>
        <h4>Select Spot:</h4>
        <select onChange={handleStationChange}>
          {data.map((spot, index) => (
            <option value={spot.spotBuoyIds[0]} id={spot._id}>
              {spot.spotName}
            </option>
          ))};
        </select>
      </div>
    </div>
  );
}

export default SelectSpotMenu;
