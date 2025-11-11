import { Maze } from '@/utils/mazeGenerator';
import octopusImg from '@/assets/octopus.png';
import coralReefImg from '@/assets/coral-reef.png';

type Position = { row: number; col: number };

type GameBoardProps = {
  maze: Maze;
  playerPos: Position;
  goalPos: Position;
  hintPath: Position[];
  solutionPath: Position[];
  hasWon: boolean;
  solverType?: string;
};

const GameBoard = ({ maze, playerPos, goalPos, hintPath, solutionPath, hasWon, solverType = 'BFS' }: GameBoardProps) => {
  const isHintCell = (row: number, col: number) => {
    return hintPath.some(pos => pos.row === row && pos.col === col);
  };

  const isSolutionCell = (row: number, col: number) => {
    return solutionPath.some(pos => pos.row === row && pos.col === col);
  };

  const getSolutionColorClass = () => {
    switch (solverType) {
      case 'BFS':
        return 'bg-blue-500 opacity-70 animate-pulse'; // Blue with pulse for BFS
      case 'DFS':
        return 'bg-green-500 opacity-70 animate-pulse'; // Green with pulse for DFS
      case 'Bidirectional':
        return 'bg-purple-500 opacity-70 animate-pulse'; // Purple with pulse for Bidirectional BFS
      default:
        return 'bg-blue-500 opacity-70 animate-pulse'; // Default to blue
    }
  };

  const cellSize = 'w-6 h-6 md:w-8 md:h-8';

  return (
    <div className="flex justify-center items-center">
      <div className="inline-block p-4 bg-card rounded-2xl border-2 border-border shadow-2xl">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 21}, minmax(0, 1fr))` }}>
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
              const isGoal = goalPos.row === rowIndex && goalPos.col === colIndex;
              const isHint = isHintCell(rowIndex, colIndex);
              const isSolution = isSolutionCell(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    ${cellSize}
                    relative
                    transition-all duration-200
                    ${cell.isWall ? 'bg-[hsl(var(--maze-wall))]' : 'bg-[hsl(var(--maze-path))]'}
                    ${isHint && !cell.isWall ? 'bg-[hsl(var(--maze-hint))] animate-glow' : ''}
                    ${isSolution && !cell.isWall && !isHint ? getSolutionColorClass() : ''}
                    ${isGoal ? 'bg-[hsl(var(--goal-coral))]' : ''}
                  `}
                >
                  {isPlayer && (
                    <div className={`absolute inset-0 flex items-center justify-center ${hasWon ? 'animate-bounce' : 'transition-all duration-200'}`}>
                      <img 
                        src={octopusImg} 
                        alt="Octopus" 
                        className="w-full h-full object-contain animate-float"
                      />
                    </div>
                  )}
                  {isGoal && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={coralReefImg} 
                        alt="Coral Reef" 
                        className={`w-full h-full object-contain ${hasWon ? '' : 'animate-pulse-slow'}`}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
