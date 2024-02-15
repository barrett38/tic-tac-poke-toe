import { useState, useEffect } from "react";

export default function Player({
  initialName,
  symbol,
  isActive,
  onChangedName,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPlayerName(initialName);
  }, [initialName]);

  function handleEditClick() {
    setIsEditing((editing) => !editing);
    if (isEditing) {
      onChangedName(symbol, playerName);
    }
  }

  function handleChange(event) {
    setPlayerName(event.target.value);
  }

  let editablePlayerName = <span className="player-name">{playerName}</span>;

  if (isEditing) {
    editablePlayerName = (
      <input type="text" required value={playerName} onChange={handleChange} />
    );
  }

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {editablePlayerName}
        <img className="player-symbol" src={symbol} alt="player symbol" />
      </span>
      <button onClick={handleEditClick} tabIndex="0">
        {isEditing ? "Save" : "Edit"}
      </button>
    </li>
  );
}
