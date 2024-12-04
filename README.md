## Overview about the making of this project

This project was a part of the CodeRapido hackathon, a 200 minute hackathon, conducted by IIT Dhanbad, where we had to make an interactive game, which includes logic as well as engaging UI under 200 minutes. A total of 100 participants took part in the contest, and my team emerged as the winner of this contest.

# Quantum Squares

Quantum Squares is a turn-based strategy game played on a 5x5 grid. Players take turns adding quantum particles to squares in an effort to control the grid. The game involves particle accumulation and the strategic use of square collapses, which can trigger chain reactions and shift control between players.

## Table of Contents

- [Overview](#overview)
- [Game Rules](#game-rules)
- [Collapse Mechanism](#collapse-mechanism)
- [Chain Reactions](#chain-reactions)
- [Victory Conditions](#victory-conditions)
- [How to Play](#how-to-play)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Game Screenshots](#game-screenshots)
- [License](#license)

## Overview

Quantum Squares is a strategic game where two players (Red and Blue) compete to control a grid by filling squares with quantum particles. A square collapses when it reaches 4 particles, redistributing them to adjacent squares, which may cause additional collapses. The goal is to control a set number of squares or have the most controlled squares when no more moves are possible.

## Game Rules

1. The game is played on a 5x5 grid, and each square can hold up to 4 particles.
2. Players can place particles in neutral squares or squares they already own.
3. A square becomes "controlled" by a player when it reaches 4 particles, and it collapses, redistributing particles to adjacent squares.
4. A player earns 1 point when they control a square, but upon collapsing, the square returns to a neutral state.
5. Players can only place particles in empty squares or squares they control. They cannot place particles in an opponent's square unless the square collapses and becomes neutral.

## Collapse Mechanism

When a square reaches 4 particles, it collapses:
- The 4 particles are redistributed to adjacent squares (up, down, left, right).
- After collapsing, the square becomes neutral, but the player retains their point for momentary control.
- If an adjacent square belongs to another player, the particle will color according to the player who owns that square, without changing its ownership.

## Chain Reactions

If adjacent squares reach 4 particles due to redistribution, they will collapse as well, causing potential chain reactions. This dynamic can lead to dramatic shifts in control, where careful planning is required to avoid strengthening an opponent’s position.

## Victory Conditions

- The game ends when a player controls 10 squares (i.e., earns 10 points).
- Alternatively, the game ends when no more moves are possible (all squares are full). The player with the most controlled squares wins.

## How to Play

1. **Start the Game**: Players take turns placing quantum particles on the grid.
2. **Place a Particle**: Click on any empty or partially filled square to add a quantum particle.
3. **Collapse**: If a square reaches 4 particles, it collapses and redistributes particles to adjacent squares.
4. **Win the Game**: Control 10 squares or the most squares when no more moves are possible.

For more details on how the game works, you can view the **How to Play** section within the game itself.

## Features

- **Turn-based Strategy**: Players alternate turns placing quantum particles and must strategize to control squares and manage collapses.
- **Dynamic Gameplay**: The collapse mechanism introduces chain reactions and shifting control, keeping the game unpredictable.
- **Real-time UI Updates**: The grid updates instantly as particles are placed and squares collapse.
- **Victory Conditions**: The game ends when a player controls 10 squares or no more moves are available.

## Technologies Used

- **React.js**: Frontend framework for building a dynamic UI.
- **Tailwind CSS**: For efficient, responsive styling.
- **Socket.io** (optional for multiplayer mode): Enables real-time communication between players.
- **React Router**: For navigating between the game and the How to Play page.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/quantum-squares.git
   cd quantum-squares```
2. **Locate the file**
```bash
cd frontend
```
3. **Start the server**
```bash
npm run dev
```

This will start the project in the localhost:5173
