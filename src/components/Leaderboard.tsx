import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { loadLeaderboard, LeaderboardEntry } from '@/utils/leaderboard';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  const refreshLeaderboard = () => {
    const loaded = loadLeaderboard();
    setEntries(loaded);
  };

  useEffect(() => {
    refreshLeaderboard();
    
    // Listen for storage changes to refresh when new scores are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'octopus_leaderboard_v1') {
        refreshLeaderboard();
      }
    };
    
    // Listen for custom event for same-tab updates
    const handleCustomStorage = () => {
      refreshLeaderboard();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leaderboardUpdated', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaderboardUpdated', handleCustomStorage);
    };
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Get rank icon
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{index + 1}</span>;
    }
  };

  return (
    <Card className="p-6 bg-card border-2 border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scores yet!</p>
            <p className="text-sm mt-2">Complete a level to see your ranking.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.score}-${entry.time}-${entry.moves}-${index}`}
                className={`p-3 rounded-lg border-2 ${
                  index === 0
                    ? 'bg-yellow-500/10 border-yellow-500'
                    : index === 1
                    ? 'bg-gray-400/10 border-gray-400'
                    : index === 2
                    ? 'bg-amber-600/10 border-amber-600'
                    : 'bg-muted border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                    <span className="font-semibold text-foreground">
                      Level {entry.level}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {entry.score}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Moves:</span> {entry.moves}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {formatTime(entry.time)}
                  </div>
                </div>
                {entry.date && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(entry.date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
