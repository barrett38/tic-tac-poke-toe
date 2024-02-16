export default function GameBoard({ onSelectSquare, board, player1, player2 }) {
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol className="row">
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  className="square"
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol && (
                    <img
                      src={playerSymbol === "X" ? player1 : player2}
                      alt={playerSymbol}
                      width="83" // width in pixels
                      height="83" // height in pixels
                    />
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
