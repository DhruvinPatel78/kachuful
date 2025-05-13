// Scoring utilities

import { Game, PlayerResult } from '../types';

export const calculateRoundScore = (selectedNumber: number, success: boolean): number => {
  if (!success) return 0;
  return selectedNumber === 0 ? 10 : parseInt(`${selectedNumber}${selectedNumber}`);
};

export const calculatePlayerTotalScore = (game: Game, playerId: string): number => {
  return game.rounds.reduce((total, round) => {
    const result = round.playerResults.find(result => result.playerId === playerId);
    return total + (result?.score || 0);
  }, 0);
};

export const getPlayerRankings = (game: Game): PlayerResult[] => {
  const playerScores = game.players.map(player => ({
    playerId: player.id,
    success: true, // Not relevant for final ranking
    score: calculatePlayerTotalScore(game, player.id)
  }));
  
  return playerScores.sort((a, b) => b.score - a.score);
};

export const calculateRoundNumbers = (playerCount: number): number[] => {
  const maxRound = Math.floor(54 / playerCount);
  
  // Ascending rounds (1 to maxRound)
  const ascending = Array.from({ length: maxRound }, (_, i) => i + 1);
  
  // Descending rounds (maxRound-1 down to 1)
  const descending = Array.from({ length: maxRound - 1 }, (_, i) => maxRound - i - 1);
  
  return [...ascending, ...descending];
};