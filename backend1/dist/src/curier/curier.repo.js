"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curierRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const curier_entity_1 = require("./curier.entity");
exports.curierRepo = data_source_1.AppDataSource.getRepository(curier_entity_1.Curier);
