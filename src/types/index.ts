// Type definitions

export interface Player {
  id: string;
  name: string;
  saved: boolean;
}

export interface PlayerSelection {
  playerId: string;
  selectedNumber: number;
}

export interface PlayerResult {
  playerId: string;
  success: boolean;
  score: number;
}

export interface Round {
  number: number;
  maxNumber: number;
  playerSelections: PlayerSelection[];
  playerResults: PlayerResult[];
  completed: boolean;
}

export interface Game {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'completed';
  players: Player[];
  rounds: Round[];
  currentRound: number;
}

export type GameContextType = {
  games: Game[];
  currentGame: Game | null;
  savedPlayers: Player[];
  createGame: (name: string) => void;
  selectGame: (gameId: string) => void;
  addPlayer: (name: string, saved: boolean) => void;
  removePlayer: (playerId: string) => void;
  startGame: () => void;
  setPlayerSelection: (playerId: string, number: number) => void;
  startRound: () => void;
  setPlayerResult: (playerId: string, success: boolean) => void;
  endRound: () => void;
  endGame: () => void;
  getRoundNumbers: (playerCount: number) => number[];
  resetContext: () => void;
};
