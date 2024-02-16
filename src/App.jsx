import { useEffect, useState } from "react";
import Player from "./components/Player.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import deriveWinner from "./deriveWinner.js";
import { getPokemon } from "./components/getPokemon.js";
import GameBoard from "./components/GameBoard.jsx";
import deriveActivePlayer from "./components/deriveActivePlayer.js";
import deriveGameBoard from "./components/derive.js";
import RefreshButton from "./components/refreshButton.jsx";

// deployment options:
// https://www.vercel.com/
// https://www.netlify.com/

function App() {
  const [player1, setPlayer1] = useState({
    name: "", // This is the default name
    symbol: "",
  });
  const [player2, setPlayer2] = useState({
    name: "", // This is the default name
    symbol: "",
  });

  const fetchAndSetPlayers = async () => {
    const allPokemon = await Promise.all([getPokemon(), getPokemon()]);
    console.log("All allPokemon", allPokemon);
    setPlayer1({ name: allPokemon[0].name, symbol: allPokemon[0].sprite });
    setPlayer2({ name: allPokemon[1].name, symbol: allPokemon[1].sprite });
  };

  useEffect(() => {
    fetchAndSetPlayers();
  }, []);

  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, { X: player1, O: player2 });
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
    if (symbol === player1.symbol) {
      setPlayer1((prevPlayer) => ({ ...prevPlayer, name: newName }));
    } else if (symbol === player2.symbol) {
      setPlayer2((prevPlayer) => ({ ...prevPlayer, name: newName }));
    }
  }

  return (
    <main>
      <div id="game-container">
        <div>
          <RefreshButton onRefresh={fetchAndSetPlayers} />
        </div>
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
