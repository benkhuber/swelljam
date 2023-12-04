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

  const sessionContainer = document.getElementById('sessionsContainer');

  const deleteSession = (e) => {
    console.log('HEY');
    console.log(e.target.parentElement.id);
  };

  useEffect(() => {
    if (sessionData && sessionData.length > 0) {
      sessionContainer.innerHTML = '';
      sessionData.forEach((session) => {
        const sessionCard = document.createElement('div');
        const spotNameCard = document.createElement('div');
        const dateTimeCard = document.createElement('div');
        const deleteSessionButton = document.createElement('button');

        sessionCard.className = 'sessionCard';
        sessionCard.id = session._id;

        dateTimeCard.value = session.dateTimeSelect;
        dateTimeCard.textContent = session.dateTimeSelect;

        spotNameCard.value = session.selectedSpot;
        spotNameCard.textContent = `Spot: ${session.selectedSpot}`;

        deleteSessionButton.textContent = 'Delete Session';
        deleteSessionButton.addEventListener('click', deleteSession);

        sessionCard.appendChild(dateTimeCard);
        sessionCard.appendChild(spotNameCard);
        sessionCard.appendChild(deleteSessionButton);

        sessionContainer.appendChild(sessionCard);
      });
    }
  }, [sessionData]);

  return (
    <div>
      <Header />

      <h3>Sessions</h3>
      <div id="sessionsContainer" />
    </div>
  );
}

export default Home;
