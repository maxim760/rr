import TinyQueue from 'tinyqueue';
import * as matrix from './matrix';
import { Matrix, Node, Path } from './types';

function createNode(
  parentMatrix: Matrix,
  path: Path,
  level: number,
  i: number,
  j: number,
): Node {
  if (level !== 0) path.push([i, j]);

  const reducedMatrix = matrix.clone(parentMatrix);
  const { length } = reducedMatrix;

  for (let k = 0; level !== 0 && k < length; k++) {
    reducedMatrix[i][k] = Infinity;
    reducedMatrix[k][j] = Infinity;
  }

  reducedMatrix[j][0] = Infinity;

  return {
    path,
    reducedMatrix,
    level,
    vertex: j,
    cost: 0,
  };
}

function reduceColumn(reducedMatrix: Matrix, column: number[]): void {
  const { length } = reducedMatrix;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (reducedMatrix[i][j] < column[j]) {
        column[j] = reducedMatrix[i][j];
      }
    }
  }

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (reducedMatrix[i][j] !== Infinity && column[j] !== Infinity) {
        reducedMatrix[i][j] -= column[j];
      }
    }
  }
}

function reduceRow(reducedMatrix: Matrix, row: number[]): void {
  const { length } = reducedMatrix;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (reducedMatrix[i][j] < row[i]) {
        row[i] = reducedMatrix[i][j];
      }
    }
  }

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (reducedMatrix[i][j] !== Infinity && row[i] !== Infinity) {
        reducedMatrix[i][j] -= row[i];
      }
    }
  }
}

function calculateCost(reducedMatrix: Matrix): number {
  const { length } = reducedMatrix;
  let cost = 0;

  let row = matrix.fill(length, Infinity);
  let col = matrix.fill(length, Infinity);

  reduceRow(reducedMatrix, row);
  reduceColumn(reducedMatrix, col);

  for (let i = 0; i < length; i++) {
    cost += row[i] !== Infinity ? row[i] : 0;
    cost += col[i] !== Infinity ? col[i] : 0;
  }

  return cost;
}

// A comparation function for the priority queue
function compareNodes(a: Node, b: Node): number {
  return a.cost - b.cost;
}

export function solve(costMatrix: Matrix): Node | null {
  // Ensure it is a valid matrix
  matrix.assert(costMatrix);

  const { length } = costMatrix;

  // create a priority queue
  const queue = new TinyQueue<Node>([], compareNodes);
  const path: Path = [];

  const root = createNode(costMatrix, path, 0, -1, 0);
  root.cost = calculateCost(root.reducedMatrix);

  queue.push(root);

  while (queue.length) {
    // Get and remove the least cost node
    const min = queue.pop()!;

    const i = min.vertex;

    if (min.level === length - 1) {
      min.path.push([i, 0]);
      return min;
    }

    for (let j = 0; j < length; j++) {
      if (min.reducedMatrix[i][j] !== Infinity) {
        const child: Node = createNode(
          min.reducedMatrix,
          min.path.slice(-length),
          min.level + 1,
          i,
          j,
        );
        child.cost =
          min.cost +
          min.reducedMatrix[i][j] +
          calculateCost(child.reducedMatrix);
        queue.push(child);
      }
    }
  }

  return null;
}