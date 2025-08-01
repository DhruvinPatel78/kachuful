import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import NumberSelector from "../components/NumberSelector";
import { useGameContext } from "../context/GameContext";
import { Check, X, ArrowRight, Trophy } from "lucide-react";

const symbols = ["♠️", "♦️", "♣️", "♥️"];

const ActiveGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const {
    // games,
    selectGame,
    currentGame,
    setPlayerSelection,
    startRound,
    setPlayerResult,
    endRound,
    endGame,
    // calculatePlayerTotalScore
  } = useGameContext();

  const [roundState, setRoundState] = useState<"selection" | "results">(
    "selection",
  );

  React.useEffect(() => {
    if (gameId && (!currentGame || currentGame.id !== gameId)) {
      selectGame(gameId);
    }
  }, [gameId, currentGame, selectGame]);

  if (!currentGame) {
    navigate("/games");
    return null;
  }

  if (currentGame.status === "completed") {
    navigate(`/results/${currentGame.id}`);
    return null;
  }

  const currentRoundIndex = currentGame.currentRound - 1;
  const currentRoundData = currentGame.rounds[currentRoundIndex];

  if (!currentRoundData) {
    navigate("/games");
    return null;
  }

  const handlePlayerNumberSelect = (playerId: string, number: number) => {
    // Calculate sum of all selected numbers including the new selection
    // const currentSum = currentRoundData.playerSelections.reduce((sum, selection) => {
    //   if (selection.playerId === playerId) return sum; // Skip the current player's old selection
    //   return sum + selection.selectedNumber;
    // }, number);

    setPlayerSelection(playerId, number);
  };

  const handleStartRound = () => {
    // const allPlayersSelected = currentGame.players.every(player =>
    //   currentRoundData.playerSelections.some(selection => selection.playerId === player.id)
    // );

    // if (allPlayersSelected) {
    startRound();
    setRoundState("results");
    // }
  };

  const handlePassFail = (playerId: string, success: boolean) => {
    setPlayerResult(playerId, success);
  };

  const handleEndRound = () => {
    const allPlayersHaveResults = currentGame.players.every((player) =>
      currentRoundData.playerResults.some(
        (result) => result.playerId === player.id,
      ),
    );

    if (allPlayersHaveResults) {
      endRound();
      setRoundState("selection");
    }
  };

  const handleEndGame = () => {
    endGame();
    navigate(`/results/${currentGame.id}`);
  };

  const getPlayerSelection = (playerId: string) => {
    return (
      currentRoundData.playerSelections.find(
        (selection) => selection.playerId === playerId,
      )?.selectedNumber || 0
    );
  };

  const getPlayerResult = (playerId: string) => {
    return currentRoundData.playerResults.find(
      (result) => result.playerId === playerId,
    );
  };

  // const allPlayersSelected = currentGame.players.every(player =>
  //   currentRoundData.playerSelections.some(selection => selection.playerId === player.id)
  // );

  const allPlayersHaveResults = currentGame.players.every((player) =>
    currentRoundData.playerResults.some(
      (result) => result.playerId === player.id,
    ),
  );

  const getPlayerTotalScore = (playerId: string) => {
    let total = 0;

    for (const round of currentGame.rounds) {
      const result = round.playerResults.find((r) => r.playerId === playerId);
      if (result) {
        total += result.score;
      }
    }

    return total;
  };

  // const getMissingSelections = () => {
  //   return currentGame.players.filter(player =>
  //     !currentRoundData.playerSelections.some(selection => selection.playerId === player.id)
  //   ).map(player => player.name);
  // };

  const getTotalSelectedNumbers = () => {
    return currentRoundData.playerSelections.reduce(
      (sum, selection) => sum + selection.selectedNumber,
      0,
    );
  };

  const totalSelectedNumbers = getTotalSelectedNumbers();
  const isRoundNumberEqual =
    totalSelectedNumbers === currentRoundData.maxNumber;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const allPass = useMemo(() => {
    const winnerSelectedNUmber = currentGame.players
      .map((item) => getPlayerResult(item.id))
      .filter((item) => item?.success)
      .map((item) => item?.playerId)
      .map(
        (iten) =>
          currentRoundData.playerSelections.find(
            (item) => item.playerId === iten,
          )?.selectedNumber,
      );
    if (winnerSelectedNUmber.length > 0) {
      // @ts-ignore
      return winnerSelectedNUmber.reduce((a, b) => a + b, 0) <= currentRoundData.number;
    } else {
      return true;
    }
  }, [currentGame, currentRoundData]);

  const getSymbol = useMemo((number) => {
  if (currentRoundData.number) {
     return { char: symbols[(currentRoundData.number - 1) % symbols.length], index: symbols.findIndex(item => item === symbols[(currentRoundData.number - 1) % symbols.length]) + 1} 
  } else return '';
  },[currentRoundData])

  return (
    <Layout
      title={`Round ${currentRoundData.number} • ${currentGame.name}`}
      showBackButton
    >
      <div className="max-w-lg mx-auto">
        <div className={"flex flex-col gap-6"}>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-300">
                Round {currentRoundData.number}  {}
              </h2>
              <span className={`text-5xl ${getSymbol.index % 2 === 0 ? 'text-danger' : "text-black"}`}>{getSymbol.char}</span>
              <div className="text-sm bg-slate-700 px-3 py-1 rounded-full">
                {roundState === "selection"
                  ? "Selection"
                  : "Results"}
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center text-sm text-slate-300 mb-2">
              <div>
                Max Number:{" "}
                <span className="font-bold">{currentRoundData.maxNumber}</span>
              </div>
              <div>
                Players:{" "}
                <span className="font-bold">{currentGame.players.length}</span>
              </div>
            </div>

            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{
                  width: `${
                    roundState === "selection"
                      ? (currentRoundData.playerSelections.length /
                          currentGame.players.length) *
                        100
                      : (currentRoundData.playerResults.length /
                          currentGame.players.length) *
                        100
                  }%`,
                }}
              ></div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              {roundState === "selection"
                ? `${currentRoundData.playerSelections.length}/${currentGame.players.length} selected`
                : `${currentRoundData.playerResults.length}/${currentGame.players.length} recorded`}
            </div>

            {roundState === "selection" && isRoundNumberEqual && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-sm text-red-400">
                  Warning: Sum of all selected numbers ({totalSelectedNumbers})
                  must equal round number ({currentRoundData.maxNumber})
                </p>
              </div>
            )}
          </div>

          <div className={"h-[1px] bg-slate-700 mb-6 "} />
        </div>
        {/* Player selections or results */}
        <div className="space-y-4 mb-8">
          {currentGame.players.map((player) => {
            const playerSelection = getPlayerSelection(player.id);
            const playerResult = getPlayerResult(player.id);
            const totalScore = getPlayerTotalScore(player.id);

            return (
              <div
                key={player.id}
                className={`bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all duration-300 ${
                  roundState === "results" && playerResult
                    ? playerResult.success
                      ? "border-green-500/50 shadow-lg shadow-green-900/20"
                      : "border-red-500/50 shadow-lg shadow-red-900/20"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-lg">{player.name}</h3>
                  <div className="text-sm text-slate-400">
                    Total Score: <span className="font-bold">{totalScore}</span>
                  </div>
                </div>

                {roundState === "selection" ? (
                  // Number selection phase
                  <div className="flex justify-center py-2">
                    <NumberSelector
                      maxNumber={currentRoundData.maxNumber}
                      selectedValue={playerSelection}
                      onSelect={(value) =>
                        handlePlayerNumberSelect(player.id, value)
                      }
                    />
                  </div>
                ) : (
                  // Pass/Fail phase
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-center">
                        <div className="text-sm text-slate-400">Selected</div>
                        <div className="text-2xl font-bold">
                          {playerSelection}
                        </div>
                      </div>

                      {playerResult && (
                        <div className="text-center">
                          <div className="text-sm text-slate-400">Result</div>
                          <div
                            className={`text-xl font-bold ${
                              playerResult.success
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {playerResult.success
                              ? `+${playerResult.score}`
                              : "0"}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => handlePassFail(player.id, true)}
                          className="w-12 h-12 flex items-center justify-center"
                        >
                          <Check size={24} />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handlePassFail(player.id, false)}
                          className="w-12 h-12 flex items-center justify-center"
                        >
                          <X size={24} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          {roundState === "selection" ? (
            <Button
              onClick={handleStartRound}
              disabled={isRoundNumberEqual}
              size="lg"
              className={"flex justify-center items-center h-10"}
            >
              Start Round
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleEndRound}
              disabled={!allPlayersHaveResults || !allPass}
              size="lg"
              className={"flex justify-center items-center h-10"}
            >
              End Round
              <ArrowRight size={16} className="ml-1" />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleEndGame}
            className={"flex justify-center items-center h-10"}
          >
            <Trophy size={16} className="mr-1" />
            End Game & View Results
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ActiveGame;
