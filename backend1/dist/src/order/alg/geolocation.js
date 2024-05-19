"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortedPoints = exports.createCostMatrix = exports.getDistanceBetweenPoints = void 0;
const matrix = __importStar(require("./matrix"));
// Earth radius in meters;
const R = 6371000;
/**
 * Convert degrees to radians.
 * @param  {number} angle
 * @return {number}
 */
function toRad(angle) {
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
function getDistanceBetweenPoints(pointA, pointB) {
    const dLon = toRad(pointB.coordinates[0] - pointA.coordinates[0]);
    const dLat = toRad(pointB.coordinates[1] - pointA.coordinates[1]);
    const lat1 = toRad(pointA.coordinates[1]);
    const lat2 = toRad(pointB.coordinates[1]);
    const a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
exports.getDistanceBetweenPoints = getDistanceBetweenPoints;
/**
 * Create a two dimensional matrix containing the
 * cost between nodes
 * @param {Point[]} points
 * @returns Array<Array<number>>
 */
function createCostMatrix(points) {
    const { length } = points;
    const costMatrix = matrix.create(points.length);
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            costMatrix[i][j] =
                i === j ? Infinity : getDistanceBetweenPoints(points[i], points[j]);
        }
    }
    return costMatrix;
}
exports.createCostMatrix = createCostMatrix;
/**
 * Return a list of sorted points based on result node
 * @param {Point[]} points
 * @param {Node} resultNode
 * @returns {Point[]}
 */
function getSortedPoints(points, resultNode) {
    const sortedPoints = [];
    const { length } = resultNode.path;
    for (let i = 0; i < length; i++) {
        const [index] = resultNode.path[i];
        sortedPoints.push(points[index]);
    }
    return sortedPoints;
}
exports.getSortedPoints = getSortedPoints;
