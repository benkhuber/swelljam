/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SessionCard from '../components/SessionCard';
import RegionalForecast from '../components/RegionalForecast';

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

  const deleteSession = async (sessionId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/deleteSession/${sessionId}`);
      console.log(response.data);
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
      <h2 className="regionalForecastTitle">Southern California Regional Forecast</h2>
      <RegionalForecast region="North Orange County" stationID="46253" />
      <RegionalForecast region="South Orange County" stationID="46277" />
      <h3 className="recentSessionsTitle">Your Recent Sessions</h3>
      <div id="sessionsContainer">
        {sessionData && sessionData.length > 0 ? (
          sessionData.slice(-3).map((session) => (
            <SessionCard session={session} onDelete={deleteSession} />
          ))
        ) : (
          <p>No recent sessions.</p>
        )}
        <div>
          {sessionData && sessionData.length > 3 && (
            <Link
              to="/viewsessions"
            >
              View All Sessions
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
