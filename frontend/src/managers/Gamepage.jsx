import React, { useState } from "react";
// import "./App.css";

const GRID_SIZE = 5;
const MAX_PARTICLES = 4;
const TARGET_SCORE = 10;

const createGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE).fill({ count: 0, owner: null })
    );

function App() {
  const [grid, setGrid] = useState(createGrid);
  const [turn, setTurn] = useState("red"); // "red" for player 1, "blue" for player 2
  const [scores, setScores] = useState({ red: 0, blue: 0 });

  // Add particle and handle collapse/chain reactions
  const addParticle = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));

    // Only allow adding if the square is neutral or owned by the current player
    if (newGrid[row][col].owner === null || newGrid[row][col].owner === turn) {
      newGrid[row][col].count++;
      newGrid[row][col].owner = turn;

      if (newGrid[row][col].count === MAX_PARTICLES) {
        collapseSquare(newGrid, row, col);
      }

      setGrid(newGrid);
      setTurn(turn === "red" ? "blue" : "red");
    }
  };

  // Handle collapse and redistribution of particles
  const collapseSquare = (grid, row, col) => {
    const owner = grid[row][col].owner;
    grid[row][col].count = 0; // Reset count
    grid[row][col].owner = null; // Neutralize the square
    setScores((prevScores) => ({
      ...prevScores,
      [owner]: prevScores[owner] + 1, // Add point to the owner of the collapsed square
    }));

    const adjacentSquares = getAdjacentSquares(row, col);
    adjacentSquares.forEach(([r, c]) => {
      grid[r][c].count++;
      
      // Only change ownership if the square was neutral before
      if (grid[r][c].owner === null) {
        grid[r][c].owner = owner;
      }

      // Trigger chain reaction if adjacent square also collapses
      if (grid[r][c].count >= MAX_PARTICLES) {
        collapseSquare(grid, r, c);
      }
    });
  };

  // Get adjacent squares for particle redistribution
  const getAdjacentSquares = (row, col) => {
    const adjacent = [];
    if (row > 0) adjacent.push([row - 1, col]); // up
    if (row < GRID_SIZE - 1) adjacent.push([row + 1, col]); // down
    if (col > 0) adjacent.push([row, col - 1]); // left
    if (col < GRID_SIZE - 1) adjacent.push([row, col + 1]); // right
    return adjacent;
  };

  // Check if a player has won
  const checkWinCondition = () => {
    if (scores.red >= TARGET_SCORE) return "Player 1 (Red) Wins!";
    if (scores.blue >= TARGET_SCORE) return "Player 2 (Blue) Wins!";
    return null;
  };

  const winner = checkWinCondition();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Quantum Squares</h1>

      {/* Display current turn */}
      <div className="mb-2">
        <span className={`font-bold ${turn === "red" ? "text-red-500" : "text-blue-500"}`}>
          {turn === "red" ? "Player 1 (Red)" : "Player 2 (Blue)"}'s Turn
        </span>
      </div>

      {/* Display the grid */}
      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 border flex items-center justify-center text-xl font-bold cursor-pointer 
                ${cell.owner === "red" ? "bg-red-300 text-red-700" : cell.owner === "blue" ? "bg-blue-300 text-blue-700" : "bg-gray-200"}`}
              onClick={() => !winner && addParticle(rowIndex, colIndex)}
            >
              {cell.count}
            </div>
          ))
        )}
      </div>

      {/* Display the score */}
      <div className="mt-4">
        <h2 className="text-2xl">Scores</h2>
        <div className="flex justify-around w-full text-lg">
          <span className="text-red-500">Red: {scores.red}</span>
          <span className="text-blue-500">Blue: {scores.blue}</span>
        </div>
      </div>

      {/* Display the winner */}
      {winner && (
        <div className="mt-4 text-2xl font-bold text-green-500">
          {winner}
        </div>
      )}
    </div>
  );
}

export default App;
