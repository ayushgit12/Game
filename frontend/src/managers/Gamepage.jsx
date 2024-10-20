import React, { useState, useRef } from "react";
import red from "../assets/red.png";
import blue from "../assets/blue.png";
import yellow from "../assets/yellow.png";
import green from "../assets/green.png";
import clickS from "../assets/click.mp3";
import boomS from "../assets/boom.mp3";
import winS from "../assets/win.mp3";
import { useLocation } from "react-router-dom";


const MAX_PARTICLES = 4;
const TARGET_SCORE = 10;



function App() {
  const location = useLocation();
  const {gridSize} = location.state || {}

const GRID_SIZE = gridSize;


const createGrid = () =>
  
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill({ count: 0, owner: null }));
  
  
  const {numPlayers} = location.state || {}
  
  
  const [grid, setGrid] = useState(createGrid);
  const [turn, setTurn] = useState("red"); // Starting with Player 1 (red)
  const [scores, setScores] = useState({ red: 0, blue: 0, yellow: 0, green: 0 });
  const [players, setPlayers] = useState(numPlayers); // Default is 2 players

  const click = useRef(new Audio(clickS));
  const boom = useRef(new Audio(boomS));
  const win = useRef(new Audio(winS));

  // Add particle and handle the collapse/chain reactions
  const addParticle = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));

    if (newGrid[row][col].owner === null || newGrid[row][col].owner === turn) {
      newGrid[row][col].count++;
      newGrid[row][col].owner = turn;

      click.current.currentTime = 0;
      click.current.play();

      if (newGrid[row][col].count === MAX_PARTICLES) {
        collapseSquare(newGrid, row, col);
      }

      setGrid(newGrid);
      changeTurn();
    }
  };

  // Function to handle turn changes based on the number of players
  const changeTurn = () => {
    if (players === 2) {
      setTurn(turn === "red" ? "blue" : "red");
    } else if (players === 3) {
      setTurn(turn === "red" ? "blue" : turn === "blue" ? "yellow" : "red");
    } else if (players === 4) {
      setTurn(
        turn === "red"
          ? "blue"
          : turn === "blue"
          ? "yellow"
          : turn === "yellow"
          ? "green"
          : "red"
      );
    }
  };

  // Handle collapse and redistribute particles
  const collapseSquare = (grid, row, col) => {
    const owner = grid[row][col].owner;
    grid[row][col].count = 0;
    grid[row][col].owner = null;
    setScores((prevScores) => ({
      ...prevScores,
      [owner]: prevScores[owner] + 1,
    }));

    boom.current.currentTime = 0;
    boom.current.play();

    const adjacentSquares = getAdjacentSquares(row, col);
    adjacentSquares.forEach(([r, c]) => {
      grid[r][c].count++;
      if (grid[r][c].owner === null) {
        grid[r][c].owner = owner;
      }

      if (grid[r][c].count >= MAX_PARTICLES) {
        collapseSquare(grid, r, c);
      }
    });
  };

  const getAdjacentSquares = (row, col) => {
    const adjacent = [];
    if (row > 0) adjacent.push([row - 1, col]);
    if (row < GRID_SIZE - 1) adjacent.push([row + 1, col]);
    if (col > 0) adjacent.push([row, col - 1]);
    if (col < GRID_SIZE - 1) adjacent.push([row, col + 1]);
    return adjacent;
  };

  const checkWinCondition = () => {
    if (scores.red >= TARGET_SCORE) return "Player 1 (Red) Wins!";
    if (scores.blue >= TARGET_SCORE) return "Player 2 (Blue) Wins!";
    if (scores.yellow >= TARGET_SCORE) return "Player 3 (Yellow) Wins!";
    if (scores.green >= TARGET_SCORE) return "Player 4 (Green) Wins!";
    return null;
  };

  const winner = checkWinCondition();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Quantum Squares</h1>

      {/* Select number of players */}
      {/* <div className="mb-2">
        <label htmlFor="players">Number of Players:</label>
        <select
          id="players"
          value={players}
          onChange={(e) => setPlayers(parseInt(e.target.value))}
        >
          <option value={2}>2 Players</option>
          <option value={3}>3 Players</option>
          <option value={4}>4 Players</option>
        </select>
      </div> */}

      {/* Display current turn */}
      <div className="mb-2">
        <span
          className={`font-bold ${
            turn === "red"
              ? "text-red-500"
              : turn === "blue"
              ? "text-blue-500"
              : turn === "yellow"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {turn === "red"
            ? "Player 1 (Red)"
            : turn === "blue"
            ? "Player 2 (Blue)"
            : turn === "yellow"
            ? "Player 3 (Yellow)"
            : "Player 4 (Green)"}'s Turn
        </span>
      </div>

      <div
  className="grid gap-2"
  style={{
    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
  }}
>
  {grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`w-16 h-16 border flex items-center justify-center text-xl font-bold cursor-pointer
          ${
            turn === "red"
              ? "bg-red-500"
              : turn === "blue"
              ? "bg-blue-500"
              : turn === "yellow"
              ? "bg-yellow-500"
              : "bg-green-500"
          }
        `}
        onClick={() => !winner && addParticle(rowIndex, colIndex)}
      >
        {cell.count < 3 ? (
          Array.from({ length: cell.count }).map((_, index) => {
            const imgSrc =
              cell.owner === "red"
                ? red
                : cell.owner === "blue"
                ? blue
                : cell.owner === "yellow"
                ? yellow
                : green;
            return (
              <img
                key={index}
                src={imgSrc}
                alt={`${cell.owner} particle`}
                className="w-6 h-6 particle-enter"
              />
            );
          })
        ) : (
          <div className="grid grid-cols-3 grid-rows-2 w-12 h-12 particle-enter">
            <img
              key="0"
              src={cell.owner === "red" ? red : cell.owner === "blue" ? blue : cell.owner === "yellow" ? yellow : green}
              alt={`${cell.owner} particle`}
              className="col-start-2 col-span-1 row-start-1 row-span-1"
            />
            <img
              key="1"
              src={cell.owner === "red" ? red : cell.owner === "blue" ? blue : cell.owner === "yellow" ? yellow : green}
              alt={`${cell.owner} particle`}
              className="col-start-1 col-span-1 row-start-2 row-span-1"
            />
            <img
              key="2"
              src={cell.owner === "red" ? red : cell.owner === "blue" ? blue : cell.owner === "yellow" ? yellow : green}
              alt={`${cell.owner} particle`}
              className="col-start-3 col-span-1 row-start-2 row-span-1"
            />
          </div>
        )}
      </div>
    ))
  )}
</div>


      {/* Display the score */}
      <div className="mt-4">
        <h2 className="text-2xl">Scores</h2>
        <div className="flex justify-between w-full text-lg">
          <span className="text-red-500 mx-20">Red: {scores.red}</span>
          <span className="text-blue-500 mx-20">Blue: {scores.blue}</span>
          {players > 2 && <span className="text-yellow-500 mx-20">Yellow: {scores.yellow}</span>}
          {players > 3 && <span className="text-green-500 mx-20">Green: {scores.green}</span>}
        </div>
      </div>

      {winner && (
        <div className="mt-4 text-xl font-bold">
          {winner}
        </div>
      )}
    </div>
  );
}

export default App;