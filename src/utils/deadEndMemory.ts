// Dead-end reinforcement memory for pathfinding optimization
type Position = { row: number; col: number };

class DeadEndMemory {
  private memory: Set<string>;

  constructor() {
    // Uses a Hash Set (Set<string>) to store dead-end coordinates as strings "row,col"
    this.memory = new Set<string>();
  }

  // Adds a position to the dead end memory
  addDeadEnd(pos: Position): void {
    const key = `${pos.row},${pos.col}`;
    this.memory.add(key);
  }

  // Checks if a position is in the dead end memory
  isDeadEnd(pos: Position): boolean {
    const key = `${pos.row},${pos.col}`;
    return this.memory.has(key);
  }

  // Clears the entire memory
  clear(): void {
    this.memory.clear();
  }
}

export const deadEndMemory = new DeadEndMemory();
