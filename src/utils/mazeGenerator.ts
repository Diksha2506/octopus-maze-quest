// Maze generation using DFS recursive backtracking
export type Position = { row: number; col: number };

export type Cell = {
  row: number;
  col: number;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
};

export type Maze = Cell[][];

const DIRECTIONS = [
  { row: -2, col: 0 },  // Up
  { row: 2, col: 0 },   // Down
  { row: 0, col: -2 },  // Left
  { row: 0, col: 2 },   // Right
];

export function generateMaze(rows: number, cols: number): Maze {
  // Initialize maze with all walls
  const maze: Maze = [];
  for (let r = 0; r < rows; r++) {
    maze[r] = [];
    for (let c = 0; c < cols; c++) {
      maze[r][c] = {
        row: r,
        col: c,
        isWall: true,
        isPath: false,
        isVisited: false,
      };
    }
  }

  // Start DFS from top-left corner (1,1)
  const startRow = 1;
  const startCol = 1;
  carvePath(maze, startRow, startCol, rows, cols);

  // Ensure start and end are paths
  maze[1][1].isWall = false;
  maze[1][1].isPath = true;
  maze[rows - 2][cols - 2].isWall = false;
  maze[rows - 2][cols - 2].isPath = true;

  return maze;
}

function carvePath(maze: Maze, row: number, col: number, rows: number, cols: number): void {
  // Mark current cell as path
  maze[row][col].isWall = false;
  maze[row][col].isPath = true;
  maze[row][col].isVisited = true;

  // Randomize directions
  const directions = [...DIRECTIONS].sort(() => Math.random() - 0.5);

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    // Check if new position is valid
    if (
      newRow > 0 &&
      newRow < rows - 1 &&
      newCol > 0 &&
      newCol < cols - 1 &&
      !maze[newRow][newCol].isVisited
    ) {
      // Carve path between current and new cell
      const wallRow = row + dir.row / 2;
      const wallCol = col + dir.col / 2;
      maze[wallRow][wallCol].isWall = false;
      maze[wallRow][wallCol].isPath = true;

      // Recursively carve from new cell
      carvePath(maze, newRow, newCol, rows, cols);
    }
  }
}
