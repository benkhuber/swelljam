/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function Home() {
  const [sessionData, setSessionData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getSessions');
        setSessionData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(sessionData);

  return (
    <div>
      <Header />
    </div>
  );
}

export default Home;
