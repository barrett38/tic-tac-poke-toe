import { useState } from "react";
import Player from "./components/Player.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning_combinations.js";
import { getRandomItem } from "./components/getRandomItem.js";

const images = [
  "./src/PokeBall/articuno.png",
  "./src/PokeBall/blastoise.png",
  "./src/PokeBall/blaziken.png",
  "./src/PokeBall/bulbasaur.png",
  "./src/PokeBall/butterfree.png",
  "./src/PokeBall/catterpie.png",
  "./src/PokeBall/charizard.png",
  "./src/PokeBall/charmander.png",
  "./src/PokeBall/cinccino.png",
  "./src/PokeBall/clefairy.png",
  "./src/PokeBall/eevee.png",
  "./src/PokeBall/ekans.png",
  "./src/PokeBall/gengar.png",
  "./src/PokeBall/mewtwo.png",
  "./src/PokeBall/ninetales.png",
  "./src/PokeBall/pikachu-hat.png",
];

let pokemon_A = getRandomItem(images);
let pokemon_B = getRandomItem(images);

if (pokemon_A === pokemon_B) {
  pokemon_A = "./src/PokeBall/arcanine.png";
}

// inserting Gameboard component here
function GameBoard({ onSelectSquare, board }) {
  const imagePaths = {
    X: pokemon_A,
    O: pokemon_B,
  };

  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol && (
                    <img src={imagePaths[playerSymbol]} alt={playerSymbol} />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

const PLAYERS = {
  X: { name: "Player 1", symbol: pokemon_A },
  O: { name: "Player 2", symbol: pokemon_B },
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

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
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

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
            initialName={players.X.name}
            symbol={players.X.symbol}
            isActive={activePlayer === "X"}
            onChangedName={handlePlayerNameChange}
          />
          <Player
            initialName={players.O.name}
            symbol={players.O.symbol}
            isActive={activePlayer === "O"}
            onChangedName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRematch} />
        )}
        <GameBoard
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
