import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useGameContext } from '../context/GameContext';

const NewGame: React.FC = () => {
  const [gameName, setGameName] = useState<string>('');
  const { createGame } = useGameContext();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;
    
    createGame(gameName);
    navigate('/setup');
  };
  
  return (
    <Layout title="New Game" showBackButton>
      <div className="max-w-md mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Create New Game</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="gameName" className="block text-sm font-medium text-slate-300 mb-2">
                Game Name
              </label>
              <input
                type="text"
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter a name for your game"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              fullWidth
              disabled={!gameName.trim()}
            >
              Continue to Player Setup
            </Button>
          </form>
        </div>
        
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
          <h3 className="text-lg font-medium mb-2">How to Play</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Create a game and add players</li>
            <li>Each round players bid a number from 0 to the current round number</li>
            <li>Players who succeed in their bid earn points (bid + 50)</li>
            <li>Rounds increase then decrease in number</li>
            <li>The player with the highest score wins!</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default NewGame;