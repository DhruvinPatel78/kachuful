import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Home from './pages/Home';
import NewGame from './pages/NewGame';
import GameSetup from './pages/GameSetup';
import GamesList from './pages/GamesList';
import ActiveGame from './pages/ActiveGame';
import GameResults from './pages/GameResults';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/game/:gameId" element={<ActiveGame />} />
          <Route path="/results/:gameId" element={<GameResults />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;