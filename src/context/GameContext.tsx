import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Game, Player, GameContextType } from "../types";
import {
  loadGames,
  saveGames,
  loadPlayers,
  savePlayers,
} from "../utils/storage";
import { calculateRoundScore, calculateRoundNumbers } from "../utils/scoring";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [savedPlayers, setSavedPlayers] = useState<Player[]>([]);

  // Load saved games and players from local storage
  useEffect(() => {
    setGames(loadGames());
    setSavedPlayers(loadPlayers());
  }, []);

  // Save games whenever they change
  useEffect(() => {
    if (games.length) {
      saveGames(games);
    }
  }, [games]);

  // Save players whenever they change
  useEffect(() => {
    if (savedPlayers.length) {
      savePlayers(savedPlayers);
    }
  }, [savedPlayers]);

  const createGame = (name: string) => {
    const newGame: Game = {
      id: uuidv4(),
      name,
      date: new Date().toISOString(),
      status: "active",
      players: [],
      rounds: [],
      currentRound: 0,
    };

    setGames([...games, newGame]);
    setCurrentGame(newGame);
  };

  const selectGame = (gameId: string) => {
    const game = games.find((g) => g.id === gameId) || null;
    setCurrentGame(game);
  };

  const addPlayer = (name: string, saved: boolean) => {
    if (!currentGame) return;

    const newPlayer: Player = {
      id: uuidv4(),
      name,
      saved,
    };

    const updatedGame = {
      ...currentGame,
      players: [...currentGame.players, newPlayer],
    };

    updateGame(updatedGame);

    if (saved && !savedPlayers.some((p) => p.name === name)) {
      setSavedPlayers([...savedPlayers, newPlayer]);
    }
  };

  const removePlayer = (playerId: string) => {
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      players: currentGame.players.filter((p) => p.id !== playerId),
    };

    updateGame(updatedGame);
  };

  const updateGame = (updatedGame: Game) => {
    setCurrentGame(updatedGame);
    setGames(games.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
  };

  const getRoundNumbers = (playerCount: number): number[] => {
    return calculateRoundNumbers(playerCount);
  };

  const startGame = () => {
    if (!currentGame || currentGame.players.length === 0) return;

    const roundNumbers = getRoundNumbers(currentGame.players.length);
    const firstRound = {
      number: 1,
      maxNumber: roundNumbers[0],
      playerSelections: currentGame.players.map((p) => ({
        playerId: p.id,
        selectedNumber: 0,
      })),
      playerResults: [],
      completed: false,
    };

    const updatedGame = {
      ...currentGame,
      rounds: [firstRound],
      currentRound: 1,
    };

    updateGame(updatedGame);
  };

  const setPlayerSelection = (playerId: string, number: number) => {
    if (!currentGame || currentGame.currentRound === 0) return;

    const currentRoundIndex = currentGame.currentRound - 1;
    const rounds = [...currentGame.rounds];
    const round = rounds[currentRoundIndex];

    // Remove existing selection if any
    const selections = round.playerSelections.filter(
      (s) => s.playerId !== playerId,
    );

    // Add new selection
    selections.push({ playerId, selectedNumber: number });

    rounds[currentRoundIndex] = {
      ...round,
      playerSelections: selections,
    };

    updateGame({ ...currentGame, rounds });
  };

  const startRound = () => {
    if (!currentGame || currentGame.currentRound === 0) return;

    // Nothing to do here, just a state transition
    // The UI will change to show Pass/Fail options
  };

  const setPlayerResult = (playerId: string, success: boolean) => {
    if (!currentGame || currentGame.currentRound === 0) return;

    const currentRoundIndex = currentGame.currentRound - 1;
    const rounds = [...currentGame.rounds];
    const round = rounds[currentRoundIndex];

    // Find player's selection
    const selection = round.playerSelections.find(
      (s) => s.playerId === playerId,
    );
    if (!selection) return;

    // Calculate score
    const score = calculateRoundScore(selection.selectedNumber, success);

    // Remove existing result if any
    const results = round.playerResults.filter((r) => r.playerId !== playerId);

    // Add new result
    results.push({ playerId, success, score });

    rounds[currentRoundIndex] = {
      ...round,
      playerResults: results,
    };

    updateGame({ ...currentGame, rounds });
  };

  const endRound = () => {
    if (!currentGame || currentGame.currentRound === 0) return;

    const roundNumbers = getRoundNumbers(currentGame.players.length);
    const currentRoundIndex = currentGame.currentRound - 1;
    const rounds = [...currentGame.rounds];

    // Mark current round as completed
    rounds[currentRoundIndex] = {
      ...rounds[currentRoundIndex],
      completed: true,
    };

    // Check if we have more rounds
    if (currentGame.currentRound < roundNumbers.length) {
      const nextRoundNumber = currentGame.currentRound + 1;
      const nextRound = {
        number: nextRoundNumber,
        maxNumber: roundNumbers[nextRoundNumber - 1],
        playerSelections: currentGame.players.map((p) => ({
          playerId: p.id,
          selectedNumber: 0,
        })),
        playerResults: [],
        completed: false,
      };

      rounds.push(nextRound);

      updateGame({
        ...currentGame,
        rounds,
        currentRound: nextRoundNumber,
      });
    } else {
      // No more rounds, game is complete
      updateGame({
        ...currentGame,
        rounds,
        status: "completed",
      });
    }
  };

  const endGame = () => {
    if (!currentGame) return;

    updateGame({
      ...currentGame,
      status: "completed",
    });
  };

  const resetContext = () => {
    setGames([]);
    setCurrentGame(null);
    setSavedPlayers([]);
  };

  const value: GameContextType = {
    games,
    currentGame,
    savedPlayers,
    createGame,
    selectGame,
    addPlayer,
    removePlayer,
    startGame,
    setPlayerSelection,
    startRound,
    setPlayerResult,
    endRound,
    endGame,
    getRoundNumbers,
    resetContext,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
