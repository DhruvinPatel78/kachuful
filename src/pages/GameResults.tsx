import React, {useEffect, useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useGameContext } from '../context/GameContext';
import { Trophy, BarChart3 } from 'lucide-react';
import {Round} from "../types";

const GameResults: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { selectGame, currentGame } = useGameContext();

  const playerRankings = useMemo(() => {
    return currentGame?.rounds?.find((item:Round) => item.completed)?.playerResults || [];
  },[currentGame, gameId])

  // Select the game if not already selected
  useEffect(() => {
    if (gameId && (!currentGame || currentGame.id !== gameId)) {
      selectGame(gameId);
    }
  }, [gameId, currentGame, selectGame]);

  if (!currentGame) {
    navigate('/games');
    return null;
  }

  // const playerRankings = getPlayerRankings(currentGame);

  // Get the player by ID
  const getPlayerById = (playerId: string) => {
    return currentGame.players.find(player => player.id === playerId);
  };


  return (
    <Layout title={`Results • ${currentGame.name}`} showBackButton>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl overflow-hidden mb-4">
            <div className="p-6 text-center">
              <Trophy size={48} className="mx-auto mb-2 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-1">Game Results</h2>
              <p className="text-slate-300">
                {new Date(currentGame.date).toLocaleDateString()} • {currentGame.players.length} players • {currentGame.rounds.length} rounds
              </p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <BarChart3 size={20} className="text-emerald-500 mr-2" />
              <h3 className="text-xl font-semibold">Final Rankings</h3>
            </div>

            <div className="space-y-4">
              {playerRankings.map((playerResult, index) => {
                const player = getPlayerById(playerResult.playerId);
                return player ? (
                  <div
                    key={player.id}
                    className={`${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/30' 
                        : index === 1 
                          ? 'bg-gradient-to-r from-slate-400/10 to-slate-300/5 border-slate-400/30' 
                          : index === 2 
                            ? 'bg-gradient-to-r from-amber-700/10 to-amber-600/5 border-amber-700/30' 
                            : 'bg-slate-800 border-slate-700'
                    } border rounded-lg p-4 transition-all duration-300`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                          index === 1 ? 'bg-slate-400/20 text-slate-300' :
                          index === 2 ? 'bg-amber-600/20 text-amber-400' :
                          'bg-slate-700/20 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{player.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Final Score</div>
                        <div className="text-2xl font-bold">{playerResult.score}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/games')}
            size="lg"
          >
            Back to Games
          </Button>
          <Button
            onClick={() => navigate('/new-game')}
            size="lg"
            className={'flex justify-center items-center'}
          >
            <Trophy size={16} className="mr-1" />
            New Game
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default GameResults;
