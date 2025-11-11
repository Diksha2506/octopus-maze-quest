# 🐙 Octopus Maze Quest

An interactive maze game built with React, TypeScript, and Vite featuring an octopus theme.

## Features

- **Procedural Maze Generation**: Uses DFS (Depth-First Search) recursive backtracking algorithm
- **AI Assistant**: Provides hints and guidance during gameplay
- **Game Statistics**: Track performance and progress
- **Leaderboard**: Compete with other players
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Structures**: AVL Tree, Pathfinding algorithms

## Project Structure

```
src/
├── components/          # React components
│   ├── GameBoard.tsx
│   ├── GameStats.tsx
│   ├── AIAssistant.tsx
│   ├── Leaderboard.tsx
│   └── ui/             # UI component library
├── utils/              # Utility functions
│   ├── mazeGenerator.ts
│   ├── pathfinder.ts
│   ├── leaderboard.ts
│   └── deadEndMemory.ts
├── data-structures/    # Data structure implementations
│   └── AVLTree.ts
└── pages/             # Page components
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Game Instructions

1. Navigate through the procedurally generated maze
2. Reach the exit to complete the level
3. Use the AI Assistant for hints
4. Track your stats on the leaderboard

## Algorithm Details

- **Maze Generation**: DFS Recursive Backtracking
- **Pathfinding**: A* or similar pathfinding algorithm
- **Data Structure**: AVL Tree for efficient operations

## License

MIT

## Author

Created as a semester 3 course project.
