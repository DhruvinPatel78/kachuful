import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import PlayerCard from '../components/PlayerCard';
import { useGameContext } from '../context/GameContext';
import { Plus, Save, Users } from 'lucide-react';

const GameSetup: React.FC = () => {
  const { currentGame, addPlayer, removePlayer, savedPlayers, startGame } = useGameContext();
  const navigate = useNavigate();
  
  const [gameName, setGameName] = useState<string>(currentGame?.name || '');
  const [playerName, setPlayerName] = useState<string>('');
  const [savePlayer, setSavePlayer] = useState<boolean>(false);
  const [showSavedPlayers, setShowSavedPlayers] = useState<boolean>(false);
  
  if (!currentGame) {
    navigate('/new-game');
    return null;
  }
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    
    addPlayer(playerName, savePlayer);
    setPlayerName('');
    setSavePlayer(false);
  };
  
  const handleSavedPlayerSelect = (name: string) => {
    addPlayer(name, true);
    setShowSavedPlayers(false);
  };
  
  const handleStartGame = () => {
    startGame();
    navigate(`/game/${currentGame.id}`);
  };
  
  const filteredSavedPlayers = savedPlayers.filter(
    savedPlayer => !currentGame.players.some(
      gamePlayer => gamePlayer.name.toLowerCase() === savedPlayer.name.toLowerCase()
    )
  );

  return (
    <Layout title="Game Setup" showBackButton>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="gameName" className="block text-sm font-medium text-slate-300 mb-1">
            Game Name
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter game name"
            disabled
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Users size={20} className="mr-2" />
              Players ({currentGame.players.length})
            </h2>
            {filteredSavedPlayers.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSavedPlayers(!showSavedPlayers)}
              >
                Saved Players
              </Button>
            )}
          </div>
          
          {showSavedPlayers && filteredSavedPlayers.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4 animate-fadeIn">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Select Saved Players</h3>
              <div className="space-y-2">
                {filteredSavedPlayers.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-700 cursor-pointer"
                    onClick={() => handleSavedPlayerSelect(player.name)}
                  >
                    <span>{player.name}</span>
                    <Plus size={16} className="text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleAddPlayer} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter player name"
              />
              <Button type="submit" disabled={!playerName.trim()}>
                Add
              </Button>
            </div>
            
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="savePlayer"
                checked={savePlayer}
                onChange={(e) => setSavePlayer(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 h-4 w-4"
              />
              <label htmlFor="savePlayer" className="ml-2 text-sm text-slate-300 flex items-center">
                <Save size={14} className="mr-1" />
                Save this player for future games
              </label>
            </div>
          </form>
          
          {currentGame.players.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {currentGame.players.map(player => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  onRemove={removePlayer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-800/50 border border-slate-700 border-dashed rounded-lg">
              <p className="text-slate-400">No players added yet</p>
              <p className="text-sm text-slate-500 mt-1">Add players to continue</p>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-slate-700">
          <Button 
            onClick={handleStartGame}
            fullWidth
            size="lg"
            disabled={currentGame.players.length < 2}
          >
            Start Game
          </Button>
          {currentGame.players.length < 2 && (
            <p className="text-center text-sm text-slate-400 mt-2">
              Add at least 2 players to start the game
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GameSetup;