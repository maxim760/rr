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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solve = void 0;
const tinyqueue_1 = __importDefault(require("tinyqueue"));
const matrix = __importStar(require("./matrix"));
function createNode(parentMatrix, path, level, i, j) {
    if (level !== 0)
        path.push([i, j]);
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
function reduceColumn(reducedMatrix, column) {
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
function reduceRow(reducedMatrix, row) {
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
function calculateCost(reducedMatrix) {
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
function compareNodes(a, b) {
    return a.cost - b.cost;
}
function solve(costMatrix) {
    // Ensure it is a valid matrix
    matrix.assert(costMatrix);
    const { length } = costMatrix;
    // create a priority queue
    const queue = new tinyqueue_1.default([], compareNodes);
    const path = [];
    const root = createNode(costMatrix, path, 0, -1, 0);
    root.cost = calculateCost(root.reducedMatrix);
    queue.push(root);
    while (queue.length) {
        // Get and remove the least cost node
        const min = queue.pop();
        const i = min.vertex;
        if (min.level === length - 1) {
            min.path.push([i, 0]);
            return min;
        }
        for (let j = 0; j < length; j++) {
            if (min.reducedMatrix[i][j] !== Infinity) {
                const child = createNode(min.reducedMatrix, min.path.slice(-length), min.level + 1, i, j);
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
exports.solve = solve;
