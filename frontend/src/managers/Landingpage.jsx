import React, { useRef, useState } from 'react';
import ParticlesBg from 'particles-bg';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import intro from "../assets/intro.mp3";

function LandingPage() {
    const navigate = useNavigate();
    const audioRef = useRef(null); // Create a ref to hold the audio element
    const [isPlaying, setIsPlaying] = useState(false); // State to track audio playback

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause(); // Pause the audio
            } else {
                audioRef.current.play(); // Play the audio
            }
            setIsPlaying(!isPlaying); // Toggle the playing state
        }
    };

    const handleStart = () => {
        navigate('/gamesettings'); // Navigate to game settings
    };

    return (
        <div className="relative bg-black flex items-center justify-center h-screen">
            {/* Particle Background in the foreground */}
            <ParticlesBg type="fountain" />

            {/* Audio button at the top for play/mute */}
            <div className="absolute top-4 right-4 z-30">
                <button 
                    onClick={toggleAudio}
                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-all"
                    aria-label={isPlaying ? "Mute audio" : "Play audio"}
                >
                    {isPlaying ? "🔇" : "🔊"}
                </button>
            </div>

            <div className="absolute top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
                        Quantum Squares
                    </h1>
                    <TypeAnimation
                        sequence={[
                            'A Quantum Strategy Game', // The text to display
                            2000,
                        ]}
                        wrapper="p"
                        cursor={true} // Enable blinking cursor
                        className="text-2xl text-white font-semibold mb-8 drop-shadow-md"
                    />
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-110 drop-shadow-md"
                        onClick={handleStart}
                    >
                        Start Game
                    </button>
                </div>
            </div>

            {/* Audio element to play the sound indefinitely */}
            <audio ref={audioRef} loop>
                <source src={intro} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default LandingPage;
