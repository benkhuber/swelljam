/* eslint-disable no-restricted-syntax */
import React from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages_2/Home';
import AddSession from './pages/AddSession';
import SpotForecast from './pages/SpotForecast';
import Map from './pages/Map';
import SessionDetail from './pages/SessionDetail';
import EditSession from './pages/EditSession';
import About from './pages/About';
import ViewSessions from './pages/ViewSessions';

const deleteSession = async (sessionId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/deleteSession/${sessionId}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/addsession" element={<AddSession />} />
        <Route path="/surfreport" element={<SpotForecast />} />
        <Route path="/map" element={<Map />} />
        <Route path="/session/:sessionId" element={<SessionDetail onDelete={deleteSession} />} />
        <Route path="/editsession/:sessionId" element={<EditSession onDelete={deleteSession} />} />
        <Route path="/viewsessions" element={<ViewSessions />} />
      </Routes>
    </Router>
  );
}

export default App;
