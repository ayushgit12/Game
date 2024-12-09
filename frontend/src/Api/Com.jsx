import React, { useState, useEffect, useRef } from "react";
import red from "../assets/red.png";
import blue from "../assets/blue.png";
import clickS from "../assets/click.mp3";
import boomS from "../assets/boom.mp3";
import winS from "../assets/win.mp3";
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
  const [turn, setTurn] = useState(0); // Track turn (0: Player, 1: AI)
  const [scores, setScores] = useState({}); // Scores for player and AI
  const location = useLocation();
  const { gridSize } = location.state || {}; // Grid size passed via router state

  const [gridSize1] = useState(gridSize); // Fixed grid size
  const [username, setUsername] = useState(""); // Player's username
  const [grid, setGrid] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const usernames = [username, "AI"]; // Usernames array: [Player, AI]

  // Sound effects
  const clickSound = useRef(new Audio(clickS));
  const boomSound = useRef(new Audio(boomS));
  const winSound = useRef(new Audio(winS));

  const MAX_PARTICLES = 4; // Max particles in a square
  const TARGET_SCORE = 10; // Score required to win

  // Create an empty grid
  const createGrid = () =>
    Array(gridSize1)
      .fill(null)
      .map(() =>
        Array(gridSize1).fill({ count: 0, owner: null })
      );

  // Initialize grid and scores when game starts
  useEffect(() => {
    if (gameStarted) {
      const initialScores = { [username]: 0, AI: 0 };
      setScores(initialScores);
      setGrid(createGrid());
    }
  }, [gameStarted]);

  // AI makes its move when it's their turn
  useEffect(() => {
    if (gameStarted && turn === 1) {
      setTimeout(() => {
        const move = getRandomMove(grid, "AI");
        if (move) {
          addParticle(move[0], move[1]);
        }
      }, 1000);
    }
  }, [turn, grid, gameStarted]);

  // Add a particle to the grid and handle the turn
  const addParticle = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));

    if (newGrid[row][col].owner === null || newGrid[row][col].owner === usernames[turn]) {
      newGrid[row][col].count++;
      newGrid[row][col].owner = usernames[turn];
      clickSound.current.play();

      if (newGrid[row][col].count === MAX_PARTICLES) {
        boomSound.current.play();
        collapseSquare(newGrid, row, col);
      }

      setGrid(newGrid);
      setTurn((turn + 1) % 2); // Switch turn between player (0) and AI (1)
    }
  };

  // Handle square collapse and redistribution of particles
  const collapseSquare = (grid, row, col) => {
    const owner = grid[row][col].owner;
    grid[row][col].count = 0; // Reset count
    grid[row][col].owner = null; // Neutralize the square

    setScores((prevScores) => ({
      ...prevScores,
      [owner]: prevScores[owner] + 1, // Award points for collapsed square
    }));

    const adjacentSquares = getAdjacentSquares(row, col);
    adjacentSquares.forEach(([r, c]) => {
      grid[r][c].count++;
      if (grid[r][c].owner === null) {
        grid[r][c].owner = owner;
      }
      if (grid[r][c].count >= MAX_PARTICLES) {
        collapseSquare(grid, r, c); // Trigger chain reaction
      }
    });
  };

  // Get adjacent squares for redistribution
  const getAdjacentSquares = (row, col) => {
    const adjacent = [];
    if (row > 0) adjacent.push([row - 1, col]); // Up
    if (row < gridSize1 - 1) adjacent.push([row + 1, col]); // Down
    if (col > 0) adjacent.push([row, col - 1]); // Left
    if (col < gridSize1 - 1) adjacent.push([row, col + 1]); // Right
    return adjacent;
  };

  // Check for a win condition
  const checkWinCondition = () => {
    for (let player of usernames) {
      if (scores[player] >= TARGET_SCORE) {
        winSound.current.play();
        return `${player} Wins!`;
      }
    }
    return null;
  };

  const winner = checkWinCondition();

  const startGame = () => {
    if (username.trim()) {
      setGameStarted(true);
    } else {
      toast.error("Please enter a valid username");
    }
  };

  const getImage = (owner) => {
    if (owner === usernames[0]) return red;
    if (owner === usernames[1]) return blue;
    return null;
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
          <div className="mb-2">
            <span className={`font-bold ${turn === 0 ? "text-red-500" : "text-blue-500"}`}>
              {usernames[turn]}'s Turn
            </span>
          </div>
          <div
            className={`grid grid-cols-${gridSize1} gap-2`}
            style={{ gridTemplateColumns: `repeat(${gridSize1}, 1fr)` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 border flex items-center justify-center text-xl font-bold cursor-pointer ${
                    cell.owner === usernames[0]
                      ? "bg-red-300"
                      : cell.owner === usernames[1]
                      ? "bg-blue-300"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    !winner && usernames[turn] === username && addParticle(rowIndex, colIndex)
                  }
                >
                  {cell.count > 0 && (
                    <div className="flex flex-wrap justify-center items-center">
                      {Array.from({ length: cell.count }).map((_, index) => (
                        <img
                          key={index}
                          src={getImage(cell.owner)}
                          alt={cell.owner}
                          className="h-6 w-6 m-0.5"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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
          {winner && (
            <div className="mt-4 text-2xl font-bold text-green-500">{winner}</div>
          )}
        </>
      )}
    </div>
  );
}

export default Com;
