"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../core/types");
const curier_entity_1 = require("./curier.entity");
const curier_repo_1 = require("./curier.repo");
class CurierController {
    getAll(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const result = yield curier_repo_1.curierRepo.find();
                return res.json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, phone, status } = req.body;
                if (!status) {
                    return res.status(400).json({ message: "Статус не указан" });
                }
                const curierItemFromDb = yield curier_repo_1.curierRepo.findOneByOrFail({ id });
                curierItemFromDb.name = name;
                curierItemFromDb.phone = phone;
                curierItemFromDb.status = status;
                const result = yield curier_repo_1.curierRepo.save(curierItemFromDb);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, phone } = req.body;
                const curier = new curier_entity_1.Curier();
                curier.name = name;
                curier.phone = phone;
                curier.status = types_1.CurierStatus.Free;
                curier.orders = [];
                const result = yield curier_repo_1.curierRepo.save(curier);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { curierId } = req.params;
                const curier = yield curier_repo_1.curierRepo.findOneByOrFail({ id: curierId });
                if (curier.status !== types_1.CurierStatus.Free) {
                    return res.status(409).json({ message: 'Курьер несет заказ, его нельзя удалить' });
                }
                yield curier_repo_1.curierRepo.delete({ id: curierId });
                return res.status(200).json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new CurierController;
