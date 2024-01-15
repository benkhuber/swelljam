import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SessionCard from '../components/SessionCard';

function ViewSessions() {
  const [sessionData, setSessionData] = useState([]);

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

  const deleteSession = async (sessionId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/deleteSession/${sessionId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  useEffect(() => {
  }, [sessionData]);

  return (
    <div>
      <Header />
      <h3>All Sessions</h3>
      <div id="sessionsContainer">
        {sessionData.length > 0 ? (
          sessionData.map((session) => (
            <SessionCard key={session.id} session={session} onDelete={deleteSession} />
          ))
        ) : (
          <p>No recent sessions.</p>
        )}
      </div>
    </div>
  );
}

export default ViewSessions;
