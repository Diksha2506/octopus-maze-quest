// Pathfinding algorithms for AI hints
import { Maze, Position } from './mazeGenerator';
import { deadEndMemory } from './deadEndMemory';

// Directions: up, down, left, right
const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

/**
 * Depth-First Search pathfinding using a Stack
 * Finds any valid path from start to end (not necessarily shortest)
 */
export function findDFSPath(
  maze: Maze,
  start: Position,
  end: Position
): Position[] {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Stack for DFS (using array with push/pop)
  const stack: Array<{ pos: Position; path: Position[] }> = [
    { pos: start, path: [start] }
  ];
  
  // Visited set
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    const { pos, path } = current;
    
    // Check if we reached the goal
    if (pos.row === end.row && pos.col === end.col) {
      return path;
    }
    
    // Get valid neighbors
    const validNeighbors: Array<{ pos: Position; path: Position[] }> = [];
    
    for (const dir of DIRECTIONS) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      const key = `${newRow},${newCol}`;
      const newPos = { row: newRow, col: newCol };
      
      // Check if valid, not visited, and not a known dead end
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !maze[newRow][newCol].isWall &&
        !visited.has(key) &&
        !deadEndMemory.isDeadEnd(newPos)
      ) {
        validNeighbors.push({
          pos: newPos,
          path: [...path, newPos]
        });
      }
    }
    
    // If no valid neighbors, this is a dead end
    if (validNeighbors.length === 0) {
      deadEndMemory.addDeadEnd(pos);
    } else {
      // Add neighbors to stack (reverse order for consistent exploration)
      for (let i = validNeighbors.length - 1; i >= 0; i--) {
        const neighbor = validNeighbors[i];
        const key = `${neighbor.pos.row},${neighbor.pos.col}`;
        visited.add(key);
        stack.push(neighbor);
      }
    }
  }
  
  // No path found
  return [];
}

/**
 * Bidirectional Breadth-First Search pathfinding
 * Uses two concurrent BFS searches from start and end positions
 */
export function findBidirectionalBFSPath(
  maze: Maze,
  start: Position,
  end: Position
): Position[] {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Two queues for bidirectional search
  const queueA: Array<{ pos: Position; path: Position[] }> = [
    { pos: start, path: [start] }
  ];
  const queueB: Array<{ pos: Position; path: Position[] }> = [
    { pos: end, path: [end] }
  ];
  
  // Two separate visited sets with parent tracking
  const visitedA = new Map<string, Position | null>();
  const visitedB = new Map<string, Position | null>();
  
  visitedA.set(`${start.row},${start.col}`, null);
  visitedB.set(`${end.row},${end.col}`, null);
  
  // Helper function to get valid neighbors
  const getValidNeighbors = (pos: Position, visited: Map<string, Position | null>): Position[] => {
    const neighbors: Position[] = [];
    
    for (const dir of DIRECTIONS) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      const key = `${newRow},${newCol}`;
      const newPos = { row: newRow, col: newCol };
      
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !maze[newRow][newCol].isWall &&
        !visited.has(key)
      ) {
        neighbors.push(newPos);
      }
    }
    
    return neighbors;
  };
  
  // Helper function to reconstruct path
  const reconstructPath = (meetingPoint: Position): Position[] => {
    const path: Position[] = [];
    
    // Build path from start to meeting point
    let current = meetingPoint;
    while (current) {
      path.unshift(current);
      const key = `${current.row},${current.col}`;
      current = visitedA.get(key) || null;
    }
    
    // Build path from meeting point to end
    current = visitedB.get(`${meetingPoint.row},${meetingPoint.col}`);
    while (current) {
      path.push(current);
      const key = `${current.row},${current.col}`;
      current = visitedB.get(key) || null;
    }
    
    return path;
  };
  
  while (queueA.length > 0 || queueB.length > 0) {
    // Process from start direction
    if (queueA.length > 0) {
      const current = queueA.shift()!;
      const { pos } = current;
      
      // Check if this position was visited by the other search
      const key = `${pos.row},${pos.col}`;
      if (visitedB.has(key)) {
        return reconstructPath(pos);
      }
      
      const neighbors = getValidNeighbors(pos, visitedA);
      
      // Add neighbors to queue
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        visitedA.set(neighborKey, pos);
        queueA.push({ pos: neighbor, path: [] }); // Path not needed for bidirectional
      }
    }
    
    // Process from end direction
    if (queueB.length > 0) {
      const current = queueB.shift()!;
      const { pos } = current;
      
      // Check if this position was visited by the other search
      const key = `${pos.row},${pos.col}`;
      if (visitedA.has(key)) {
        return reconstructPath(pos);
      }
      
      const neighbors = getValidNeighbors(pos, visitedB);
      
      // Add neighbors to queue
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        visitedB.set(neighborKey, pos);
        queueB.push({ pos: neighbor, path: [] }); // Path not needed for bidirectional
      }
    }
  }
  
  // No path found
  return [];
}

/**
 * Single-direction Breadth-First Search pathfinding (renamed from findShortestPath)
 * Finds the shortest path using BFS with dead-end memory integration
 */
export function findSingleBFSPath(
  maze: Maze,
  start: Position,
  end: Position
): Position[] {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // BFS queue
  const queue: Array<{ pos: Position; path: Position[] }> = [
    { pos: start, path: [start] }
  ];
  
  // Visited set
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const { pos, path } = current;
    
    // Check if we reached the goal
    if (pos.row === end.row && pos.col === end.col) {
      return path;
    }
    
    // Get valid neighbors
    const validNeighbors: Array<{ pos: Position; path: Position[] }> = [];
    
    for (const dir of DIRECTIONS) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      const key = `${newRow},${newCol}`;
      const newPos = { row: newRow, col: newCol };
      
      // Check if valid, not visited, and not a known dead end
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !maze[newRow][newCol].isWall &&
        !visited.has(key) &&
        !deadEndMemory.isDeadEnd(newPos)
      ) {
        validNeighbors.push({
          pos: newPos,
          path: [...path, newPos]
        });
      }
    }
    
    // If no valid neighbors, this is a dead end
    if (validNeighbors.length === 0) {
      deadEndMemory.addDeadEnd(pos);
    } else {
      // Add neighbors to queue
      for (const neighbor of validNeighbors) {
        const key = `${neighbor.pos.row},${neighbor.pos.col}`;
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }
  
  // No path found
  return [];
}

// Keep the old function name for backward compatibility
export const findShortestPath = findSingleBFSPath;
