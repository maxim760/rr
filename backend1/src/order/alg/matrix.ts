import { Matrix } from './types';

export function create(size: number, init: number = 0): Matrix {
  const matrix: Matrix = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!Array.isArray(matrix[i])) {
        matrix[i] = [];
      }
      matrix[i][j] = init;
    }
  }

  return matrix;
}

export function clone(matrix: Matrix): Matrix {
  const { length } = matrix;
  const clone: Matrix = [];

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (!Array.isArray(clone[i])) {
        clone[i] = [];
      }
      clone[i][j] = matrix[i][j];
    }
  }

  return clone;
}

export function fill(size: number, init: number): number[] {
  const filled: number[] = [];

  for (let i = 0; i < size; i++) {
    filled[i] = init;
  }

  return filled;
}

export function assert(matrix: Matrix): void {
  const { length } = matrix;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (!Array.isArray(matrix[i])) {
        throw new TypeError('Expecting matrix to be two dimensional');
      }

      if (matrix[i].length !== length) {
        throw new Error('Expecting matrix to have same column count as rows');
      }

      if (typeof matrix[i][j] !== 'number') {
        throw new TypeError('Expecting matrix to contain only numeric values');
      }
    }
  }
}