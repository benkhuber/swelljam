import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/buoydata/realtime/46253');
        setItems(response.data);
        console.log(items);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items</h1>
    </div>
  );
}

export default Home;
