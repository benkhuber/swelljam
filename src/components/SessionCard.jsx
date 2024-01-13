import React from 'react';
import { useNavigate } from 'react-router-dom';

function SessionCard({ session, onDelete }) {
  const navigate = useNavigate();
  console.log(session);

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

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/editsession/${session._id}`, { state: { session } });
  };

  const getBorderColorClass = (rating) => {
    if (rating >= 8) {
      return 'highRatingBorder';
    } if (rating >= 5) {
      return 'mediumRatingBorder';
    }
    return 'lowRatingBorder';
  };

  return (
    <div className={`sessionCard ${getBorderColorClass(session.averageRating)}`} id={session._id} onClick={handleCardClick}>
      <div className="sessionCardDetails">
        <div className="sessionCardInfoPane">
          <div>{dateTimePST}</div>
          <div>{session.selectedSpot}</div>
          <div>{session.primarySwellHeight} m at {session.primarySwellPeriod} seconds
            from {session.primarySwellDirection} degrees
          </div>
          <div className="sessionCardButtons">
            <button type="button" onClick={handleDeleteClick}>Delete Session</button>
            <button type="button" onClick={handleEditClick}>Edit Session</button>
          </div>
        </div>
        <div className="sessionCardRating">{session.averageRating}</div>
      </div>
    </div>
  );
}

export default SessionCard;
