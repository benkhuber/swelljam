import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';

function SessionDetail() {
  const { sessionId } = useParams();
  const { state: { session } } = useLocation();

  console.log(session);

  console.log(sessionId);

  return (
    <div><Header />

      <p>Session Details</p>
      <div>Spot: {session.selectedSpot}</div>
    </div>
  );
}

export default SessionDetail;
