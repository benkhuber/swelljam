import React from 'react';

function SessionCard({ session, onDelete }) {
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

  return (
    <div className="sessionCard" id={session._id}>
      <div>{dateTimePST}</div>
      <div>Spot: {session.selectedSpot}</div>
      <div>Wave Rating: {session.waveRating}</div>
      <div>Size Rating: {session.sizeRating}</div>
      <div>Wind Rating: {session.windRating}</div>
      <div>Crowd Rating: {session.CrowdRating}</div>
      <div>{session.primarySwellHeight} m at {session.primarySwellPeriod} seconds
        from {session.primarySwellDirection} degrees
      </div>
      <button type="button" onClick={() => onDelete(session._id)}>Delete Session</button>
    </div>
  );
}

export default SessionCard;
