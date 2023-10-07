import React, { useState } from 'react';
import axios from 'axios';

function AddSpot() {
  const [postData, setPostData] = useState({
    spotName: '',
    buoyIds: [],
  });

  const handlePostButtonClick = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/addData', postData);
      console.log('Data added successfully:', response.data.message);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <div>
      <div>AddSpot</div>
      <input
        type="text"
        placeholder="Spot Name"
      />
      <button type="submit" onClick={handlePostButtonClick}>Add Data</button>
    </div>
  );
}

export default AddSpot;
