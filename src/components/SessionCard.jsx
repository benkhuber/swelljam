import React from 'react';
import { useNavigate } from 'react-router-dom';

function SessionCard({ session, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(session._id);
    navigate(`/session/${session._id}`, { state: { session } });
  };

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

  const dateTimePST = parseDateTimeToPST(session.dateTimeSelect);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(session._id);
  };

  return (
    <div className="sessionCard" id={session._id} onClick={handleCardClick}>
      <div>{dateTimePST}</div>
      <div>Spot: {session.selectedSpot}</div>
      <div>Wave Rating: {session.waveRating}</div>
      <div>Size Rating: {session.sizeRating}</div>
      <div>Wind Rating: {session.windRating}</div>
      <div>Crowd Rating: {session.CrowdRating}</div>
      <div>{session.primarySwellHeight} m at {session.primarySwellPeriod} seconds
        from {session.primarySwellDirection} degrees
      </div>
      <button type="button" onClick={handleDeleteClick}>Delete Session</button>
    </div>
  );
}

export default SessionCard;
