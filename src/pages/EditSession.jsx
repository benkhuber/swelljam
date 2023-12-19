import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

function EditSession() {
  const { state: { session } } = useLocation();

  console.log(session);

  return (
    <div><Header />
      <h3>Edit Session</h3>
      <p>To be continued...</p>
    </div>
  );
}

export default EditSession;
