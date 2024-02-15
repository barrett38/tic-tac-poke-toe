import React from "react";
import "../index.css"; // Import the CSS file

export default function RefreshButton({ onRefresh }) {
  const handleClick = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <button id="reset" className="refresh-button" onClick={handleClick}>
      GET POKEMON!!!
    </button>
  );
}

/*

For FULL refrersh:
<RefreshButton />

For select refresh:
<RefreshButton onRefresh={refreshFunction} />
refreshFunction is the function to be called when the button is clicked.
Only this will be refreshed, not the whole page.

*/

// usage idea in CSS:
// .refresh-button {
//   background-color: #383624;
//   border: none;
//   color: #f6e35a;
//   font-family: "Caprasimo", cursive;
//   padding: 15px 32px;
//   text-align: center;
//   text-decoration: none;
//   display: inline-block;
//   font-size: 16px;
//   margin: 4px 2px;
//   cursor: pointer;
//   animation: pulse 2s infinite ease-in-out;
//   border-color: #f6e35a;
// }
