import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import Button from '../components/Button';
import { useGameContext } from '../context/GameContext';
import { PlusCircle, Filter } from 'lucide-react';

const GamesList: React.FC = () => {
  const { games, selectGame } = useGameContext();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get('status');

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>(
    statusFilter === 'active' ? 'active' :
    statusFilter === 'completed' ? 'completed' : 'all'
  );

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    return game.status === filter;
  });

  const handleGameSelect = (gameId: string) => {
    selectGame(gameId);
    const game = games.find(g => g.id === gameId);

    if (game?.status === 'active') {
      navigate(`/game/${gameId}`);
    } else {
      navigate(`/results/${gameId}`);
    }
  };

  return (
    <Layout title="Games" showBackButton>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Games</h1>
            <p className="text-slate-400 text-sm">
              {games.length} game{games.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="flex bg-slate-800 rounded-md p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'active' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'completed' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>

            <Button className={'flex justify-center items-center'} onClick={() => navigate('/new-game')}>
              <PlusCircle size={16} className="mr-1" />
              New Game
            </Button>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onClick={handleGameSelect}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <Filter size={32} className="mx-auto mb-3 text-slate-500" />
            <h3 className="text-lg font-medium mb-2">No games found</h3>
            <p className="text-slate-400 mb-4">
              {filter === 'all'
                ? "You haven't created any games yet."
                : `You don't have any ${filter} games.`}
            </p>
            <Button onClick={() => navigate('/new-game')}>
              Create Your First Game
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GamesList;
