export type LeaderboardEntry = {
  score: number;
  moves: number;
  time: number;
  level: number;
  date?: string;
};

type Node = {
  entry: LeaderboardEntry;
  left: Node | null;
  right: Node | null;
  height: number;
};

/**
 * AVL Tree specialized for LeaderboardEntry ordering.
 * Order: higher score is better (comes first). For equal scores, lower time is better.
 */
export class AVLTree {
  root: Node | null = null;

  private height(node: Node | null) {
    return node ? node.height : 0;
  }

  private updateHeight(node: Node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  // Comparator: returns negative if a should come before b (i.e. a is "better" than b)
  private cmp(a: LeaderboardEntry, b: LeaderboardEntry) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    // scores equal -> prefer lower time
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    // fallback to fewer moves
    if (a.moves < b.moves) return -1;
    if (a.moves > b.moves) return 1;
    return 0;
  }

  private rotateRight(y: Node): Node {
    const x = y.left!;
    const T2 = x.right;

    // Rotate
    x.right = y;
    y.left = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private rotateLeft(x: Node): Node {
    const y = x.right!;
    const T2 = y.left;

    // Rotate
    y.left = x;
    x.right = T2;

    // Update heights
    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  private getBalance(node: Node | null) {
    if (!node) return 0;
    return this.height(node.left) - this.height(node.right);
  }

  insert(entry: LeaderboardEntry) {
    this.root = this._insert(this.root, entry);
  }

  private _insert(node: Node | null, entry: LeaderboardEntry): Node {
    if (!node) {
      return { entry, left: null, right: null, height: 1 };
    }

    const comparison = this.cmp(entry, node.entry);
    if (comparison < 0) {
      node.left = this._insert(node.left, entry);
    } else {
      node.right = this._insert(node.right, entry);
    }

    this.updateHeight(node);

    const balance = this.getBalance(node);

    // Left Left
    if (balance > 1 && this.cmp(entry, node.left!.entry) < 0) {
      return this.rotateRight(node);
    }

    // Right Right
    if (balance < -1 && this.cmp(entry, node.right!.entry) > 0) {
      return this.rotateLeft(node);
    }

    // Left Right
    if (balance > 1 && this.cmp(entry, node.left!.entry) > 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Left
    if (balance < -1 && this.cmp(entry, node.right!.entry) < 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // In-order traversal producing an array in the comparator order (best -> worst)
  toArray(): LeaderboardEntry[] {
    const result: LeaderboardEntry[] = [];
    const traverse = (node: Node | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.entry);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }
}

export default AVLTree;
