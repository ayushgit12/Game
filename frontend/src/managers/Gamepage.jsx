import React, { useState } from 'react';

const gridSize = 5;
const maxParticles = 4;

const App = () => {
  // Initial state
  const [grid, setGrid] = useState(initializeGrid());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [gameEnded, setGameEnded] = useState(false);

  // Initialize grid
  function initializeGrid() {
    let initialGrid = [];
    for (let i = 0; i < gridSize; i++) {
      let row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push({ particles: 0, owner: null });
      }
      initialGrid.push(row);
    }
    return initialGrid;
  }

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (gameEnded) return;

    const square = grid[row][col];

    // Only allow moves on empty squares or squares owned by the current player
    if (square.owner === null || square.owner === currentPlayer) {
      const newGrid = [...grid];
      addParticle(newGrid, row, col);
    } else {
      alert("You can only place particles on empty squares or your own squares!");
    }
  };

  // Add particle to the square
  const addParticle = (newGrid, row, col) => {
    const square = newGrid[row][col];
    square.particles++;
    square.owner = currentPlayer; // Change ownership to current player if it was empty

    // Check for collapse
    if (square.particles >= maxParticles) {
      collapseSquare(newGrid, row, col);
    } else {
      // Update grid
      setGrid(newGrid);
      switchPlayer();
    }
  };

  // Handle square collapse
  const collapseSquare = (newGrid, row, col) => {
    const square = newGrid[row][col];
    square.particles = 0; // Reset particles
    square.owner = null;  // Reset ownership

    // Update player score
    const newScores = { ...scores };
    newScores[`p${currentPlayer}`]++;
    setScores(newScores);

    // Redistribute particles to adjacent squares
    redistributeParticles(newGrid, row, col);

    // Update grid
    setGrid(newGrid);

    // Check for game end
    if (newScores.p1 >= 10 || newScores.p2 >= 10) {
      setGameEnded(true);
    } else {
      switchPlayer();
    }
  };

  // Redistribute particles
  const redistributeParticles = (newGrid, row, col) => {
    const adjacent = [
      [row - 1, col], // up
      [row + 1, col], // down
      [row, col - 1], // left
      [row, col + 1]  // right
    ];

    adjacent.forEach(([r, c]) => {
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        const adjacentSquare = newGrid[r][c];
        adjacentSquare.particles++;

        // If the adjacent square is owned by the opponent, do not change ownership
        if (adjacentSquare.owner === null || adjacentSquare.owner === currentPlayer) {
          adjacentSquare.owner = currentPlayer;
        }

        // Check for chain reactions
        if (adjacentSquare.particles >= maxParticles) {
          collapseSquare(newGrid, r, c);
        }
      }
    });
  };

  // Switch player turn
  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  // Reset the game
  const resetGame = () => {
    setGrid(initializeGrid());
    setScores({ p1: 0, p2: 0 });
    setCurrentPlayer(1);
    setGameEnded(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Quantum Squares</h1>

      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, rowIndex) => (
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-20 h-20 flex items-center justify-center text-2xl font-bold cursor-pointer border-2 ${
                square.owner === 1 ? 'bg-red-500 text-white' : square.owner === 2 ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {square.particles}
            </div>
          ))
        ))}
      </div>

      <div className="mt-6 text-lg">
        {gameEnded
          ? `Game Over! Player ${scores.p1 >= 10 ? 1 : 2} Wins!`
          : `Player ${currentPlayer}'s Turn`}
      </div>

      <div className="mt-4 flex space-x-8">
        <div>Player 1 Score: {scores.p1}</div>
        <div>Player 2 Score: {scores.p2}</div>
      </div>

      {gameEnded && (
        <button
          onClick={resetGame}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

export default App;
