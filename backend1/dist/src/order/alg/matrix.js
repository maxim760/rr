"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.fill = exports.clone = exports.create = void 0;
function create(size, init = 0) {
    const matrix = [];
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
exports.create = create;
function clone(matrix) {
    const { length } = matrix;
    const clone = [];
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
exports.clone = clone;
function fill(size, init) {
    const filled = [];
    for (let i = 0; i < size; i++) {
        filled[i] = init;
    }
    return filled;
}
exports.fill = fill;
function assert(matrix) {
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
exports.assert = assert;
