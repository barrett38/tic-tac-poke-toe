import { useEffect, useState } from "react";
import Player from "./components/Player.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning_combinations.js";
import { getPokemon } from "./components/getPokemon.js";
import GameBoard from "./components/GameBoard.jsx";
import deriveActivePlayer from "./components/deriveActivePlayer.js";

const PLAYERS = {
  X: { name: "Player 1", symbol: "" },
  O: { name: "Player 2", symbol: "" },
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

const fetchAndSetPlayers = async (setPlayer1, setPlayer2) => {
  const allPokemon = await Promise.all([getPokemon(), getPokemon()]);
  console.log("All allPokemon", allPokemon);
  setPlayer1((player1) => ({ ...player1, symbol: allPokemon[0] }));
  setPlayer2((player2) => ({ ...player2, symbol: allPokemon[1] }));
};

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol].name;
    }
  }
  return winner;
}

function App() {
  const [player1, setPlayer1] = useState({
    name: "Pokemon Trainer 1", // This is the default name
    symbol: "",
  });
  const [player2, setPlayer2] = useState({
    name: "Pokemon Trainer 2", // This is the default name
    symbol: "",
  });

  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    fetchAndSetPlayers(setPlayer1, setPlayer2);
  }, []);

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRematch() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: { ...prevPlayers[symbol], name: newName },
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={player1.name}
            symbol={player1.symbol}
            isActive={activePlayer === "X"}
            onChangedName={handlePlayerNameChange}
          />
          <Player
            initialName={player2.name}
            symbol={player2.symbol}
            isActive={activePlayer === "O"}
            onChangedName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRematch} />
        )}
        <GameBoard
          player1={player1.symbol}
          player2={player2.symbol}
          onSelectSquare={handleSelectSquare}
          activePlayerSymbol={activePlayer}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
