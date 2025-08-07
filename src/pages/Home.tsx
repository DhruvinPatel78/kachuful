import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { PlusCircle, List, Trophy, History, Download } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { isInstallable, triggerInstallPrompt, isStandalone } from '../utils/pwa';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { games } = useGameContext();

  const activeGames = games.filter(g => g.status === 'active');
  const completedGames = games.filter(g => g.status === 'completed');

  const handleInstall = async () => {
    await triggerInstallPrompt();
  };

  return (
    <Layout title="Kachuful Scoreboard">
      <div className="max-w-md mx-auto">
        <div className="bg-[url('https://images.pexels.com/photos/6664193/pexels-photo-6664193.jpeg')] bg-cover bg-center rounded-xl overflow-hidden mb-8">
          <div className="bg-slate-900/80 backdrop-blur-sm p-6">
            <h2 className="text-3xl font-bold mb-3">Welcome to the Game</h2>
            <p className="text-slate-300 mb-6">
              Track scores, manage rounds, and crown champions with our scoreboard app.
            </p>
            <Button
              onClick={() => navigate('/new-game')}
              size="lg"
              className="group"
            >
              <PlusCircle className="inline mr-2 group-hover:rotate-90 transition-transform duration-300" size={18} />
              New Game
            </Button>
            
            {isInstallable() && !isStandalone() && (
              <Button
                onClick={handleInstall}
                variant="outline"
                size="lg"
                className="group mt-3"
              >
                <Download className="inline mr-2 group-hover:scale-110 transition-transform duration-300" size={18} />
                Install App
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-emerald-600/30 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => navigate('/games')}
          >
            <List className="text-emerald-500 mb-3" size={24} />
            <h3 className="text-lg font-medium mb-1">All Games</h3>
            <p className="text-sm text-slate-400">View and manage all your games</p>
          </div>

          <div
            className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-emerald-600/30 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => navigate('/games?status=active')}
          >
            <Trophy className="text-emerald-500 mb-3" size={24} />
            <h3 className="text-lg font-medium mb-1">Active Games</h3>
            <p className="text-sm text-slate-400">
              {activeGames.length > 0
                ? `${activeGames.length} game${activeGames.length !== 1 ? 's' : ''} in progress`
                : 'No active games'}
            </p>
          </div>
        </div>

        {completedGames.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <History size={18} className="text-slate-400 mr-2" />
              <h3 className="text-lg font-medium">Recent Games</h3>
            </div>

            <div className="space-y-3">
              {completedGames.slice(0, 3).map(game => (
                <div
                  key={game.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center hover:border-slate-600 cursor-pointer transition-all"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div>
                    <h4 className="font-medium">{game.name}</h4>
                    <p className="text-sm text-slate-400">
                      {new Date(game.date).toLocaleDateString()} • {game.players.length} players
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
