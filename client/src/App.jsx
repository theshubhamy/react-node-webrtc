import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Lobby from './pages/Lobby';
import VideoCall from './pages/VideoCall';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/live/:userId/:roomId" element={<VideoCall />} />
    </Routes>
  );
};

export default App;
