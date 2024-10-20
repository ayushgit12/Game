import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSettings = () => {
  const [gameMode, setGameMode] = useState('AI'); // AI or Player vs Player or Rapid
  const [numPlayers, setNumPlayers] = useState(2); // Default to 2 players
  const [usernames, setUsernames] = useState(['']); // Initial usernames array for AI mode
  const [gridSize, setGridSize] = useState(5); // Default grid size
  const [error, setError] = useState('');
  const [maxGridDimension, setMaxGridDimension] = useState(300); // Initial max grid size
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Function to calculate the available screen size and set the grid dimensions accordingly
    const handleResize = () => {
      const availableWidth = window.innerWidth * 0.8; // 80% of screen width
      const availableHeight = window.innerHeight * 0.8; // 80% of screen height
      const newMaxDimension = Math.min(availableWidth, availableHeight); // Max dimension for the grid
      setMaxGridDimension(newMaxDimension);
    };

    // Call the function initially and on window resize
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGameModeChange = (e) => {
    setGameMode(e.target.value);
    if (e.target.value === 'AI') {
      setNumPlayers(1); // Set to 1 for AI mode
      setUsernames(['']); // Only one username for AI
    } else {
      setNumPlayers(2); // Default to 2 players for Player modes
      setUsernames(['', '']); // Prepare for two usernames
    }
  };

  const handleUsernameChange = (index, value) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  const handleNumPlayersChange = (e) => {
    const newNumPlayers = parseInt(e.target.value);
    setNumPlayers(newNumPlayers);
    setUsernames(new Array(newNumPlayers).fill('')); // Adjust usernames array length
  };

  const handleGridSizeChange = (e) => {
    setGridSize(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for unique usernames only in Player vs Player or Rapid mode
    if (gameMode !== 'AI') {
      const uniqueUsernames = new Set(usernames);
      if (uniqueUsernames.size !== usernames.length) {
        setError('Usernames must be unique.');
        return;
      }
    }
    setError('');

    // Store settings in localStorage or navigate with state
    localStorage.setItem('usernames', JSON.stringify(usernames));
    localStorage.setItem('gridSize', gridSize);
    
    // Navigate to the game page with the relevant settings
    if (gameMode === "AI") {
      navigate('/com', {
        state: { gridSize }
      });
    }
    else if(gameMode === "Rapid"){
      navigate('/rapid')
    }
     else {
      navigate('/game', {
        state: { numPlayers, usernames, gridSize, gameMode }
      });
    }
  };

  // Calculate square size based on grid size and maximum available space
  const squareSize = Math.min(maxGridDimension / gridSize, 60); // Max square size is 60px
  const fontSize = squareSize * 0.4; // Text size proportional to square size

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black p-6">
      {/* Game settings form */}
      <div className="flex-1 mb-6 md:mr-4">
        <h1 className="text-3xl font-bold mb-4 text-white">Game Settings</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-white">
              Game Mode:
              <select
                value={gameMode}
                onChange={handleGameModeChange}
                className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="AI">Player vs AI</option>
                <option value="Player">Player vs Player</option>
                <option value="Rapid">Rapid Game</option>
              </select>
            </label>
          </div>

          {/* Number of Players - hidden for AI mode */}
          {gameMode !== 'AI' && (
            <div className="mb-4">
              <label className="block mb-2 text-white">
                Number of Players:
                <select
                  value={numPlayers}
                  onChange={handleNumPlayersChange}
                  className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
            </div>
          )}

          {/* Username input - hidden for AI mode */}
          {gameMode !== 'AI' && (
            Array.from({ length: numPlayers }).map((_, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2 text-white">
                  Username {index + 1}:
                  <input
                    type="text"
                    value={usernames[index]}
                    onChange={(e) => handleUsernameChange(index, e.target.value)}
                    className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
                    required
                  />
                </label>
              </div>
            ))
          )}

          <div className="mb-4">
            <label className="block mb-2 text-white">
              Grid Size:
              <select
                value={gridSize}
                onChange={handleGridSizeChange}
                className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
              >
                <option value={5}>5x5</option>
                <option value={6}>6x6</option>
                <option value={7}>7x7</option>
                <option value={8}>8x8</option>
                <option value={9}>9x9</option>
                <option value={10}>10x10</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 rounded transition-all"
          >
            Start Game
          </button>
        </form>
      </div>

      {/* Grid display */}
      <div className="flex-1 items-center justify-center mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-white">Grid Preview</h2>
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: '5px',
            height: `${squareSize * gridSize}px`,
            width: `${squareSize * gridSize}px`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-yellow-500 border border-gray-500"
              style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
                fontSize: `${fontSize}px`, // Adjust text size based on square size
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
