import React, { useState, useRef, useEffect } from "react";
import red from "../assets/red.png";
import blue from "../assets/blue.png";
import clickS from "../assets/click.mp3";
import boomS from "../assets/boom.mp3";
import winS from "../assets/win.mp3";

const GRID_SIZE = 5;
const MAX_PARTICLES = 4;
const TARGET_SCORE = 10;
const MOVE_TIME_LIMIT = 10;

const createGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill({ count: 0, owner: null }));

function Rapid() {
  const [grid, setGrid] = useState(createGrid);
  const [turn, setTurn] = useState("red"); // "red" for player 1, "blue" for player 2
  const [scores, setScores] = useState({ red: 0, blue: 0 });
  const [timer, setTimer] = useState(MOVE_TIME_LIMIT);
  const [isGameOver, setIsGameOver] = useState("");
  const click = useRef(new Audio(clickS));
  const boom = useRef(new Audio(boomS));
  const win = useRef(new Audio(winS));
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start the timer
    startTimer();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [turn]);

  const startTimer = () => {
    setTimer(MOVE_TIME_LIMIT);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsGameOver(turn);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const addParticle = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));

    // Only allow adding if the square is neutral or owned by the current player
    if (newGrid[row][col].owner === null || newGrid[row][col].owner === turn) {
      newGrid[row][col].count++;
      newGrid[row][col].owner = turn;

      click.current.currentTime = 0; // Reset to start
      click.current.play();

      if (newGrid[row][col].count === MAX_PARTICLES) {
        collapseSquare(newGrid, row, col);
      }

      setGrid(newGrid);
      setTurn(turn === "red" ? "blue" : "red");
      startTimer(); // Restart timer on valid move
    }
  };

  const collapseSquare = (grid, row, col) => {
    const owner = grid[row][col].owner;
    grid[row][col].count = 0; // Reset count
    grid[row][col].owner = null; // Neutralize the square
    setScores((prevScores) => ({
      ...prevScores,
      [owner]: prevScores[owner] + 1, // Add point to the owner of the collapsed square
    }));

    boom.current.currentTime = 0; // Reset to start
    boom.current.play();

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

  const getAdjacentSquares = (row, col) => {
    const adjacent = [];
    if (row > 0) adjacent.push([row - 1, col]); // up
    if (row < GRID_SIZE - 1) adjacent.push([row + 1, col]); // down
    if (col > 0) adjacent.push([row, col - 1]); // left
    if (col < GRID_SIZE - 1) adjacent.push([row, col + 1]); // right
    return adjacent;
  };

  const checkWinCondition = () => {
    if (scores.red >= TARGET_SCORE || isGameOver=== "blue" ) {
      win.current.currentTime = 0; // Reset to start
      win.current.play();
    //   setIsGameOver(turn);
      return "Player 1 (Red) Wins!";
    }
    if (scores.blue >= TARGET_SCORE || isGameOver=== "red") {
      win.current.currentTime = 0; // Reset to start
      win.current.play();
    //   setIsGameOver(turn);
      return "Player 2 (Blue) Wins!";
    }
    return null;
  };

  const winner = checkWinCondition();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Quantum Squares: Rapid Mode</h1>

      {/* Display current turn */}
      <div className="mb-2">
        <span className={`font-bold ${turn === "red" ? "text-red-500" : "text-blue-500"}`}>
          {turn === "red" ? "Player 1 (Red)" : "Player 2 (Blue)"}'s Turn
        </span>
      </div>

      {/* Display timer */}
      <div className="mb-2">
            {
                !isGameOver && (
                    
                    <span className="text-lg">
                        Time Left: {isGameOver ? "Game Over!" : timer} seconds
        </span>
        )

            }
      </div>

      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 border flex items-center justify-center text-xl font-bold cursor-pointer ${
                turn === "red" ? "bg-red-300" : "bg-blue-300"
              }`}
              onClick={() => !winner && !isGameOver && addParticle(rowIndex, colIndex)}
            >
              {cell.count < 3 ? (
                Array.from({ length: cell.count }).map((_, index) => {
                  // For cell.count === 1, ball takes up the whole box
                  if (cell.count === 1) {
                    return (
                      <img
                        key={index}
                        src={cell.owner === "red" ? red : blue}
                        alt={`${cell.owner} particle`}
                        className="w-12 h-12 particle-enter" // Ball takes up the whole grid cell with animation
                      />
                    );
                  } 
                  // For cell.count === 2, balls are smaller and aligned side by side
                  else if (cell.count === 2) {
                    return (
                      <img
                        key={index}
                        src={cell.owner === "red" ? red : blue}
                        alt={`${cell.owner} particle`}
                        className="w-6 h-6 particle-enter" // Balls are half the size with animation
                      />
                    );
                  }
                  return null; // Default return in case of no match
                })
              ) : (
                <div className="grid grid-cols-3 grid-rows-2 w-12 h-12 particle-enter">
                  <img
                    key="0"
                    src={cell.owner === "red" ? red : blue}
                    alt={`${cell.owner} particle`}
                    className="col-start-2 col-span-1 row-start-1 row-span-1"
                  />
                  <img
                    key="1"
                    src={cell.owner === "red" ? red : blue}
                    alt={`${cell.owner} particle`}
                    className="col-start-1 col-span-1 row-start-2 row-span-1"
                  />
                  <img
                    key="2"
                    src={cell.owner === "red" ? red : blue}
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

export default Rapid;