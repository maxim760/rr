import * as matrix from './matrix';
import { Point, Matrix, Node } from './types';

// Earth radius in meters;
const R = 6371000;

/**
 * Convert degrees to radians.
 * @param  {number} angle
 * @return {number}
 */
function toRad(angle: number): number {
  return (angle * Math.PI) / 180;
}

/**
 * Calculate the distance between two geographical
 * points using haversine formula.
 * @param  {Point} pointA
 * @param  {Point} pointB
 * @param  {string} unit
 * @return {number}
 */
export function getDistanceBetweenPoints(pointA: Point, pointB: Point): number {
  const dLon = toRad(pointB.coordinates[0] - pointA.coordinates[0]);
  const dLat = toRad(pointB.coordinates[1] - pointA.coordinates[1]);

  const lat1 = toRad(pointA.coordinates[1]);
  const lat2 = toRad(pointB.coordinates[1]);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Create a two dimensional matrix containing the
 * cost between nodes
 * @param {Point[]} points
 * @returns Array<Array<number>>
 */
export function createCostMatrix(points: Point[]): Matrix {
  const { length } = points;

  const costMatrix: Matrix = matrix.create(points.length);

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      costMatrix[i][j] =
        i === j ? Infinity : getDistanceBetweenPoints(points[i], points[j]);
    }
  }

  return costMatrix;
}

/**
 * Return a list of sorted points based on result node
 * @param {Point[]} points
 * @param {Node} resultNode
 * @returns {Point[]}
 */
export function getSortedPoints(points: Point[], resultNode: Node): Point[] {
  const sortedPoints: Point[] = [];
  const { length } = resultNode.path;

  for (let i = 0; i < length; i++) {
    const [index] = resultNode.path[i];
    sortedPoints.push(points[index]);
  }

  return sortedPoints;
}