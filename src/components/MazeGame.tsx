import { useState, useEffect, useCallback } from 'react';
import { generateMaze, Maze } from '@/utils/mazeGenerator';
import { findSingleBFSPath, findDFSPath, findBidirectionalBFSPath } from '@/utils/pathfinder';
import { addLeaderboardEntry, clearLeaderboard } from '@/utils/leaderboard';
import Leaderboard from './Leaderboard';
import GameBoard from './GameBoard';
import GameStats from './GameStats';
import AIAssistant from './AIAssistant';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RotateCcw, Lightbulb, MapPin, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Position = { row: number; col: number };

// Calculate maze size based on level (increases with difficulty)
const getMazeSize = (level: number) => {
  const baseSize = 15;
  const increment = Math.floor((level - 1) / 2) * 4;
  return Math.min(baseSize + increment, 31); // Max size 31, must be odd
};

const MazeGame = () => {
  const [level, setLevel] = useState(1);
  const [mazeSize, setMazeSize] = useState(getMazeSize(1));
  const [maze, setMaze] = useState<Maze>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ row: 1, col: 1 });
  const [goalPos, setGoalPos] = useState<Position>({ row: mazeSize - 2, col: mazeSize - 2 });
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hintPath, setHintPath] = useState<Position[]>([]);
  const [solutionPath, setSolutionPath] = useState<Position[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [aiPathLength, setAiPathLength] = useState<number | null>(null);
  const [selectedSolver, setSelectedSolver] = useState<string>('BFS');

  // Clear solution when solver changes
  const handleSolverChange = (newSolver: string) => {
    setSelectedSolver(newSolver);
    if (showSolution) {
      setShowSolution(false);
      setSolutionPath([]);
    }
  };

  // Clear leaderboard on component mount
  useEffect(() => {
    clearLeaderboard();
  }, []);

  // Initialize maze when level changes
  useEffect(() => {
    const size = getMazeSize(level);
    setMazeSize(size);
    const newMaze = generateMaze(size, size);
    setMaze(newMaze);
    setGoalPos({ row: size - 2, col: size - 2 });
    setPlayerPos({ row: 1, col: 1 });
    // compute AI shortest path for this maze (from start)
    const aiPath = findSingleBFSPath(newMaze, { row: 1, col: 1 }, { row: size - 2, col: size - 2 });
    setAiPathLength(aiPath.length || null);
  }, [level]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !hasWon) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, hasWon]);

  // Start game on first move
  useEffect(() => {
    if (moves > 0 && !isRunning) {
      setIsRunning(true);
    }
  }, [moves, isRunning]);

  // Handle keyboard movement
  const handleMove = useCallback((direction: string) => {
    if (hasWon) return;

    const newPos = { ...playerPos };
    
    switch (direction) {
      case 'ArrowUp':
      case 'w':
        newPos.row -= 1;
        break;
      case 'ArrowDown':
      case 's':
        newPos.row += 1;
        break;
      case 'ArrowLeft':
      case 'a':
        newPos.col -= 1;
        break;
      case 'ArrowRight':
      case 'd':
        newPos.col += 1;
        break;
      default:
        return;
    }

      // Check if valid move
    if (
      newPos.row >= 0 &&
      newPos.row < mazeSize &&
      newPos.col >= 0 &&
      newPos.col < mazeSize &&
      !maze[newPos.row]?.[newPos.col]?.isWall
    ) {
      setPlayerPos(newPos);
      setMoves((m) => m + 1);
      
      // Check if reached goal
      if (newPos.row === goalPos.row && newPos.col === goalPos.col) {
        setHasWon(true);
        setIsRunning(false);
        
        // Calculate score (lower is better)
        const levelScore = Math.max(1000 - (moves * 10) - (time * 5), 100);
        const newTotalScore = totalScore + levelScore;
        setTotalScore(newTotalScore);
        
        // Persist new score entry to leaderboard
        addLeaderboardEntry({
          score: newTotalScore,
          moves: moves + 1,
          time,
          level,
        });
        
        toast({
          title: `🎉 Level ${level} Complete!`,
          description: `Found the reef in ${moves + 1} moves and ${time} seconds! Score: +${levelScore}`,
        });
      }
    }
  }, [playerPos, maze, hasWon, goalPos, moves, time]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        handleMove(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const handleHint = () => {
    const path = findSingleBFSPath(maze, playerPos, goalPos);
    setHintPath(path);
    setShowHint(true);
    
    toast({
      title: "💡 Hint activated!",
      description: "Follow the glowing path to reach the coral reef!",
    });
    
    // Hide hint after 5 seconds
    setTimeout(() => {
      setShowHint(false);
      setHintPath([]);
    }, 5000);
  };

  const handleSolve = () => {
    let path: Position[] = [];
    let solverName = '';
    
    switch (selectedSolver) {
      case 'BFS':
        path = findSingleBFSPath(maze, playerPos, goalPos);
        solverName = 'BFS';
        break;
      case 'DFS':
        path = findDFSPath(maze, playerPos, goalPos);
        solverName = 'DFS';
        break;
      case 'Bidirectional':
        path = findBidirectionalBFSPath(maze, playerPos, goalPos);
        solverName = 'Bidirectional BFS';
        break;
      default:
        path = findSingleBFSPath(maze, playerPos, goalPos);
        solverName = 'BFS';
    }
    
    setSolutionPath(path);
    setShowSolution(true);
    
    toast({
      title: `🗺️ ${solverName} Solution Revealed!`,
      description: `The ${solverName.toLowerCase()} path has ${path.length} steps. Path color: ${selectedSolver === 'BFS' ? '🔵 Blue' : selectedSolver === 'DFS' ? '🟢 Green' : '🟣 Purple'}`,
    });
  };

  const handleNextLevel = () => {
    setLevel((l) => l + 1);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setShowHint(false);
    setShowSolution(false);
    setHintPath([]);
    setSolutionPath([]);
    setHasWon(false);
    
    toast({
      title: `🌊 Level ${level + 1}`,
      description: "The maze gets bigger! Can you find your way?",
    });
  };

  const handleReset = () => {
    const size = getMazeSize(level);
    const newMaze = generateMaze(size, size);
    setMaze(newMaze);
    setPlayerPos({ row: 1, col: 1 });
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setShowHint(false);
    setShowSolution(false);
    setHintPath([]);
    setSolutionPath([]);
    setHasWon(false);
    // Recalculate AI path length for new maze
    const aiPath = findSingleBFSPath(newMaze, { row: 1, col: 1 }, { row: size - 2, col: size - 2 });
    setAiPathLength(aiPath.length || null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 animate-float">
            🐙 Octopus Maze Adventure
          </h1>
          <p className="text-muted-foreground text-lg">
            Help the octopus find the coral reef!
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            <GameBoard
              maze={maze}
              playerPos={playerPos}
              goalPos={goalPos}
              hintPath={showHint ? hintPath : []}
              solutionPath={showSolution ? solutionPath : []}
              hasWon={hasWon}
              solverType={selectedSolver}
            />
            
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Button
                onClick={handleHint}
                disabled={hasWon || showHint}
                variant="outline"
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Quick Hint
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <label className="text-xs text-muted-foreground">Solver:</label>
                  <Select value={selectedSolver} onValueChange={handleSolverChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Solver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BFS">🔵 BFS</SelectItem>
                      <SelectItem value="DFS">🟢 DFS</SelectItem>
                      <SelectItem value="Bidirectional">🟣 Bidirectional BFS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleSolve}
                  disabled={hasWon || showSolution}
                  variant="outline"
                  className="gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Show Solution
                </Button>
              </div>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Level
              </Button>
              {hasWon && (
                <Button
                  onClick={handleNextLevel}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Trophy className="w-4 h-4" />
                  Next Level
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <GameStats 
              moves={moves} 
              time={time} 
              hasWon={hasWon}
              level={level}
              totalScore={totalScore}
              aiPathLength={aiPathLength ?? undefined}
            />
            <Leaderboard />
            <AIAssistant 
              moves={moves} 
              hasWon={hasWon}
              showingHint={showHint}
              level={level}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-muted-foreground text-sm">
          <p>Use arrow keys or WASD to move the octopus</p>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;
