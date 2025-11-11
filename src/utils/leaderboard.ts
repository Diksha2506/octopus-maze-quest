import AVLTree, { LeaderboardEntry } from '@/data-structures/AVLTree';

// Re-export for convenience
export type { LeaderboardEntry };

const STORAGE_KEY = 'octopus_leaderboard_v1';

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];

    // Use AVL tree to ensure proper sorted order
    const tree = new AVLTree();
    for (const e of parsed) {
      // ensure date exists for display
      if (!e.date) e.date = new Date().toISOString();
      tree.insert(e);
    }

    const sorted = tree.toArray();
    // Return top 10
    return sorted.slice(0, 10);
  } catch (err) {
    console.error('Failed to load leaderboard', err);
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    // Insert into AVL tree to sort and then persist top 10
    const tree = new AVLTree();
    for (const e of entries) {
      if (!e.date) e.date = new Date().toISOString();
      tree.insert(e);
    }

    const sorted = tree.toArray().slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (err) {
    console.error('Failed to save leaderboard', err);
  }
}

/**
 * Adds a new entry to the leaderboard and saves it
 * Loads existing entries, adds the new one, and saves the top 10
 */
export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  try {
    const existing = loadLeaderboard();
    const tree = new AVLTree();
    
    // Add all existing entries
    for (const e of existing) {
      tree.insert(e);
    }
    
    // Add the new entry with date
    const newEntry: LeaderboardEntry = {
      ...entry,
      date: entry.date || new Date().toISOString(),
    };
    tree.insert(newEntry);
    
    // Save top 10
    const sorted = tree.toArray().slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    
    // Dispatch custom event to notify components in the same tab
    window.dispatchEvent(new Event('leaderboardUpdated'));
  } catch (err) {
    console.error('Failed to add leaderboard entry', err);
  }
}

/**
 * Clears the leaderboard by removing it from localStorage
 */
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Dispatch custom event to notify components in the same tab
    window.dispatchEvent(new Event('leaderboardUpdated'));
  } catch (err) {
    console.error('Failed to clear leaderboard', err);
  }
}