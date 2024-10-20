import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

function getRandomMove(grid, username) {
  const availableMoves = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.owner === null || cell.owner === username) {
        availableMoves.push([rowIndex, colIndex]);
      }
    });
  });
  if (availableMoves.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

function Com() {
  const [turn, setTurn] = useState(0); // Track turn by index
  const [scores, setScores] = useState({}); // Scores for each player
  const location = useLocation();

  const { gridSize } = location.state || {};

  const [gridSize1, setgridSize1] = useState(gridSize); // Default grid size
  const [username, setUsername] = useState(""); // Store player's username
  const [usernames, setUsernames] = useState([]); // List of players (player + AI)
  const [grid, setGrid] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const MAX_PARTICLES = 4;
  const TARGET_SCORE = 10;

  const createGrid = () =>
    Array(gridSize1)
      .fill(null)
      .map(() =>
        Array(gridSize1).fill({ count: 0, owner: null })
      );

  // Initialize scores based on number of players
  useEffect(() => {
    if (usernames.length > 0) {
      const initialScores = {};
      usernames.forEach((user) => {
        initialScores[user] = 0; // Set initial score for each player
      });
      setScores(initialScores);
      setGrid(createGrid()); // Create grid when game starts
    }
  }, [usernames, gridSize1]);

  // AI makes its move
  useEffect(() => {
    if (gameStarted && usernames[turn] === "AI") {
      setTimeout(() => {
        const move = getRandomMove(grid, "AI");
        if (move) {
          addParticle(move[0], move[1]);
        }
      }, 1000); // AI makes a move after 1 second
    }
  }, [turn, grid, gameStarted, usernames]);

  // Add particle and handle collapse/chain reactions
  const addParticle = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));

    // Only allow adding if the square is neutral or owned by the current player
    if (newGrid[row][col].owner === null || newGrid[row][col].owner === usernames[turn]) {
      newGrid[row][col].count++;
      newGrid[row][col].owner = usernames[turn];

      if (newGrid[row][col].count === MAX_PARTICLES) {
        collapseSquare(newGrid, row, col);
      }

      setGrid(newGrid);
      setTurn((turn + 1) % 2); // Cycle between player and AI
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
    if (row < gridSize1 - 1) adjacent.push([row + 1, col]); // down
    if (col > 0) adjacent.push([row, col - 1]); // left
    if (col < gridSize1 - 1) adjacent.push([row, col + 1]); // right
    return adjacent;
  };

  // Check if a player has won
  const checkWinCondition = () => {
    for (let player of usernames) {
      if (scores[player] >= TARGET_SCORE) return `${player} Wins!`;
    }
    return null;
  };

  const winner = checkWinCondition();

  const startGame = () => {
    if (username.trim()) {
      setUsernames([username.trim(), "AI"]); // Player and AI
      setGameStarted(true);
    } else {
      toast.error("Please enter a valid username");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Toaster />
      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">Quantum Squares</h1>
          <input
            type="text"
            placeholder="Enter your username"
            className="border p-2 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Quantum Squares</h1>

          {/* Display current turn */}
          <div className="mb-2">
            <span
              className={`font-bold ${
                turn === 0 ? "text-red-500" : "text-blue-500"
              }`}
            >
              {usernames[turn]}'s Turn
            </span>
          </div>

          {/* Display the grid */}
          <div
            className={`grid grid-cols-${gridSize1} gap-2`}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 border flex items-center justify-center text-xl font-bold cursor-pointer
                    ${
                      cell.owner === usernames[0]
                        ? "bg-red-300 text-red-700"
                        : cell.owner === usernames[1]
                        ? "bg-blue-300 text-blue-700"
                        : "bg-gray-200"
                    }`}
                  onClick={() =>
                    !winner && usernames[turn] !== "AI" && addParticle(rowIndex, colIndex)
                  }
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
              {usernames.map((player) => (
                <span
                  key={player}
                  className={player === usernames[0] ? "text-red-500" : "text-blue-500"}
                >
                  {player}: {scores[player]}
                </span>
              ))}
            </div>
          </div>

          {/* Display the winner */}
          {winner && (
            <div className="mt-4 text-2xl font-bold text-green-500">
              {winner}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Com;