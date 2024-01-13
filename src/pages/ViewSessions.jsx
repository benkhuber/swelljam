import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

function ViewSessions() {
  const location = useLocation();
  const { sessions } = location.state || {};
  console.log(sessions);
  return (
    <div>
      <Header />
    </div>
  );
}

export default ViewSessions;
