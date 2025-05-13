// Local storage utilities

import { Game, Player } from '../types';

const GAMES_STORAGE_KEY = 'cardGameScoreboard_games';
const PLAYERS_STORAGE_KEY = 'cardGameScoreboard_players';

export const saveGames = (games: Game[]): void => {
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
};

export const loadGames = (): Game[] => {
  const storedGames = localStorage.getItem(GAMES_STORAGE_KEY);
  return storedGames ? JSON.parse(storedGames) : [];
};

export const savePlayers = (players: Player[]): void => {
  localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
};

export const loadPlayers = (): Player[] => {
  const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
  return storedPlayers ? JSON.parse(storedPlayers) : [];
};

export const reset = () => {
  localStorage.removeItem(PLAYERS_STORAGE_KEY);
  localStorage.removeItem(GAMES_STORAGE_KEY);
};
