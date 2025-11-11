import { Card } from './ui/card';
import { Clock, Footprints, Trophy, Star, Bot } from 'lucide-react';

type GameStatsProps = {
  moves: number;
  time: number;
  hasWon: boolean;
  level: number;
  totalScore: number;
  aiPathLength?: number;
};

const GameStats = ({ moves, time, hasWon, level, totalScore, aiPathLength }: GameStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-card border-2 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-primary" />
        Game Stats
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border-2 border-accent">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">Level</span>
          </div>
          <span className="text-2xl font-bold text-accent">{level}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">Total Score</span>
          </div>
          <span className="text-xl font-bold text-primary">{totalScore}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Footprints className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">Moves</span>
          </div>
          <span className="text-2xl font-bold text-primary">{moves}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="text-foreground font-medium">Time</span>
          </div>
          <span className="text-2xl font-bold text-primary">{formatTime(time)}</span>
        </div>

        {typeof aiPathLength === 'number' && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              <span className="text-foreground font-medium">AI Shortest Path</span>
            </div>
            <span className="text-2xl font-bold text-primary">{aiPathLength}</span>
          </div>
        )}

        {typeof aiPathLength === 'number' && (
          <div className="p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
            <div className="text-sm font-medium text-foreground mb-2 text-center">AI vs Player Path Comparison</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">AI:</span>
                <span className="text-lg font-bold text-accent">{aiPathLength}</span>
              </div>
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">You:</span>
                <span className={`text-lg font-bold ${moves <= aiPathLength ? 'text-green-500' : moves > aiPathLength * 1.5 ? 'text-red-500' : 'text-primary'}`}>
                  {moves}
                </span>
              </div>
            </div>
            {moves <= aiPathLength && (
              <div className="text-center text-xs text-green-500 font-medium mt-2">
                🎯 Optimal! You matched the AI!
              </div>
            )}
            {moves > aiPathLength && moves <= aiPathLength * 1.5 && (
              <div className="text-center text-xs text-yellow-500 font-medium mt-2">
                ⚡ Good! Within 1.5x of optimal
              </div>
            )}
            {moves > aiPathLength * 1.5 && (
              <div className="text-center text-xs text-muted-foreground font-medium mt-2">
                💡 Try to get closer to {aiPathLength} moves
              </div>
            )}
          </div>
        )}

        {hasWon && (
          <div className="mt-4 p-4 bg-primary/20 border-2 border-primary rounded-lg animate-pulse-slow">
            <p className="text-center text-lg font-bold text-primary">
              🎉 Victory! 🎉
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GameStats;
