/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function Home() {
  const [sessionData, setSessionData] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getSessions');
      setSessionData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sessionContainer = document.getElementById('sessionsContainer');

  const deleteSession = async (e) => {
    const idToDelete = e.target.parentElement.id;
    console.log(idToDelete);
    try {
      const response = await axios.delete(`http://localhost:3001/api/deleteSession/${idToDelete}`);
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const renderSessionCards = (sessionDataInput) => {
    const sessionCard = document.createElement('div');
    const spotNameCard = document.createElement('div');
    const dateTimeCard = document.createElement('div');
    const deleteSessionButton = document.createElement('button');

    sessionCard.className = 'sessionCard';
    // eslint-disable-next-line no-underscore-dangle
    sessionCard.id = sessionDataInput._id;

    dateTimeCard.value = sessionDataInput.dateTimeSelect;
    dateTimeCard.textContent = sessionDataInput.dateTimeSelect;

    spotNameCard.value = sessionDataInput.selectedSpot;
    spotNameCard.textContent = `Spot: ${sessionDataInput.selectedSpot}`;

    deleteSessionButton.textContent = 'Delete Session';
    deleteSessionButton.addEventListener('click', deleteSession);

    sessionCard.appendChild(dateTimeCard);
    sessionCard.appendChild(spotNameCard);
    sessionCard.appendChild(deleteSessionButton);

    sessionContainer.appendChild(sessionCard);
  };

  useEffect(() => {
    if (sessionData && sessionData.length === 0) {
      sessionContainer.innerHTML = 'No logged sessions.';
    } else if (sessionData && sessionData.length > 6) {
      sessionContainer.innerHTML = '';

      for (let i = (sessionData.length - 6); i < sessionData.length; i++) {
        renderSessionCards(sessionData[i]);
      }
    } else if (sessionData && sessionData.length >= 0 && sessionData.length <= 6) {
      sessionContainer.innerHTML = '';
      for (let i = 0; i < sessionData.length; i++) {
        renderSessionCards(sessionData[i]);
      }
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
