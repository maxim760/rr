"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const role_entity_1 = require("./role.entity");
exports.roleRepo = data_source_1.AppDataSource.getRepository(role_entity_1.Role);
