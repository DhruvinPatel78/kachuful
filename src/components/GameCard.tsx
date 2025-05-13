import React from 'react';
import { Game } from '../types';
import Button from './Button';
import { Calendar, Users } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onClick: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const formattedDate = new Date(game.date).toLocaleDateString();
  
  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-lg p-5 transition-all duration-300 hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-900/10"
      onClick={() => onClick(game.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-xl">{game.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          game.status === 'active' 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-slate-500/20 text-slate-400'
        }`}>
          {game.status === 'active' ? 'Active' : 'Completed'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-400">
          <Calendar size={14} className="mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-slate-400">
          <Users size={14} className="mr-2" />
          {game.players.length} player{game.players.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        fullWidth
      >
        {game.status === 'active' ? 'Continue Game' : 'View Results'}
      </Button>
    </div>
  );
};

export default GameCard;