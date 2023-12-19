import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function SessionDetail({ onDelete }) {
  const { sessionId } = useParams();
  const { state: { session } } = useLocation();
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      await onDelete(session._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/editsession/${session._id}`, { state: { session } });
  };

  return (
    <div><Header />

      <p>Session Details</p>
      <div>{session.dateTimeSelect}</div>
      <div>Spot: {session.selectedSpot}</div>
      <div>Wave Rating: {session.waveRating}</div>
      <div>Size Rating: {session.sizeRating}</div>
      <div>Wind Rating: {session.windRating}</div>
      <div>Crowd Rating: {session.crowdRating}</div>
      <div>{session.primarySwellHeight} m at {session.primarySwellPeriod} seconds
        from {session.primarySwellDirection} degrees
      </div>
      <div>Water Temperature: {session.buoyWaterTemperature}</div>
      <div>Average Swell Period: {session.averageSwellPeriod} s</div>
      <button type="button" onClick={handleDeleteClick}>Delete Session</button>
      <button type="button" onClick={handleEditClick}>Edit Session</button>
    </div>
  );
}

export default SessionDetail;
