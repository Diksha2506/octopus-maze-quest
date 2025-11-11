import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

type AIAssistantProps = {
  moves: number;
  hasWon: boolean;
  showingHint: boolean;
  level: number;
};

const AIAssistant = ({ moves, hasWon, showingHint, level }: AIAssistantProps) => {
  const [message, setMessage] = useState("Hi! I'm your AI guide. Use the arrow keys or WASD to start moving!");

  useEffect(() => {
    if (hasWon) {
      setMessage(`🎊 Excellent! Level ${level} complete! Ready for the next challenge?`);
    } else if (showingHint) {
      setMessage("💡 Follow the glowing path! The BFS algorithm found the shortest route for you.");
    } else if (moves === 0) {
      setMessage(`Welcome to Level ${level}! ${level > 1 ? 'The maze is bigger now! ' : ''}Use arrow keys or WASD to navigate.`);
    } else if (moves < 10) {
      setMessage("Great start! Keep exploring the underwater maze. 🌊");
    } else if (moves < 30) {
      setMessage("You're doing well! Need help? Try the Quick Hint or Show Solution buttons. 🐙");
    } else if (moves < 50) {
      setMessage("Taking your time exploring? The 'Show Solution' button reveals the optimal BFS path! 💭");
    } else {
      setMessage("You've been swimming for a while! Try 'Show Solution' to see the full shortest path. 🎯");
    }
  }, [moves, hasWon, showingHint, level]);

  return (
    <Card className="p-6 bg-card border-2 border-border">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-accent/20 rounded-full animate-pulse-slow">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">AI Assistant</h3>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-1">💡 Did you know?</p>
        <p>This maze was generated using DFS (Depth-First Search) recursive backtracking, and hints use BFS (Breadth-First Search) to find the shortest path!</p>
      </div>
    </Card>
  );
};

export default AIAssistant;
