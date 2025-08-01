import React from 'react';
import { Player } from '../types';
import Button from './Button';
import { UserCircle, X } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onRemove?: (playerId: string) => void;
  score?: number;
  rank?: number;
  showActions?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  onRemove, 
  score, 
  rank,
  showActions = true
}) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <UserCircle size={32} className="text-slate-400" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-white">{player.name}</h3>
            {player.saved && (
              <span className="text-xs text-emerald-400">Saved Player</span>
            )}
            {score !== undefined && (
              <div className="text-sm text-slate-300 mt-1">
                Score: <span className="font-semibold text-white">{score}</span>
              </div>
            )}
            {rank !== undefined && (
              <div className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                rank === 1 ? 'bg-yellow-500/20 text-yellow-300' : 
                rank === 2 ? 'bg-slate-400/20 text-slate-300' : 
                rank === 3 ? 'bg-amber-600/20 text-amber-400' : 
                'bg-slate-600/20 text-slate-400'
              }`}>
                Rank #{rank}
              </div>
            )}
          </div>
        </div>
        
        {showActions && onRemove && (
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-red-900/30 hover:border-red-500 hover:text-red-400 transition-colors"
            onClick={() => onRemove(player.id)}
            aria-label={`Remove ${player.name}`}
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;