import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function SessionDetail({ onDelete }) {
  const { sessionId } = useParams();
  const { state: { session } } = useLocation();
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      await onDelete(sessionId);
      navigate('/');
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/editsession/${sessionId}`, { state: { session } });
  };

  const convertTempToFahrenheit = (temp) => Math.round((temp * (9 / 5)) + 32, 0);

  const parseDateTimeToPST = (dateTimeInput) => {
    const dateTimeUTC = new Date(dateTimeInput);
    const dateTimePST = dateTimeUTC.toLocaleString(
      'en-US',
      {
        timezone: 'America/Los_Angeles',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    );
    return dateTimePST;
  };

  const getColorClass = (rating) => {
    if (rating >= 8) {
      return 'highRating';
    } if (rating >= 5) {
      return 'mediumRating';
    }
    return 'lowRating';
  };

  return (
    <div><Header />
      <h2>Session Details</h2>
      <div className="sessionDetails">
        <div className="sessionDetailsDate">{parseDateTimeToPST(session.dateTimeSelect)}</div>
        <div className="sessionDetailsSpot">{session.selectedSpot}</div>
        <div className={`sessionDetailsRating ${getColorClass(session.waveRating)}`}>Wave Rating: {session.waveRating}</div>
        <div className={`sessionDetailsRating ${getColorClass(session.sizeRating)}`}>Size Rating: {session.sizeRating}</div>
        <div className={`sessionDetailsRating ${getColorClass(session.windRating)}`}>Wind Rating: {session.windRating}</div>
        <div className={`sessionDetailsRating ${getColorClass(session.crowdRating)}`}>Crowd Rating: {session.crowdRating}</div>
        <div>{session.primarySwellHeight} m at {session.primarySwellPeriod} seconds
          from {session.primarySwellDirection} degrees
        </div>
        <div>Water Temperature: {convertTempToFahrenheit(session.buoyWaterTemperature)} F</div>
        <div>Average Swell Period: {session.averageSwellPeriod} s</div>
        <div className="buttonContainer">
          <button type="button" onClick={handleDeleteClick}>Delete Session</button>
          <button type="button" onClick={handleEditClick}>Edit Session</button>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
