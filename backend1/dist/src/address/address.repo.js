"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const address_entity_1 = require("./address.entity");
exports.addressRepo = data_source_1.AppDataSource.getRepository(address_entity_1.Address);
