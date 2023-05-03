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
const user_repo_1 = require("../user/user.repo");
const certificate_entity_1 = require("./certificate.entity");
const certificate_repo_1 = require("./certificate.repo");
class CertificateController {
    getCertificates(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const userSelect = {
                    lastName: true,
                    firstName: true,
                    phone: true,
                    id: true
                };
                const received = yield certificate_repo_1.certificateRepo.find({
                    where: { toUser: { id: req.user.id } },
                    relations: { fromUser: true, toUser: true },
                    select: { fromUser: userSelect, toUser: userSelect },
                    order: { created_at: "desc" }
                });
                const donated = yield certificate_repo_1.certificateRepo.find({
                    where: { fromUser: { id: req.user.id } },
                    relations: { fromUser: true, toUser: true },
                    select: { fromUser: userSelect, toUser: userSelect },
                    order: { created_at: "desc" }
                });
                return res.json({
                    received,
                    donated
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addCertificate(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { fromUser, toUser, price } = req.body;
                const toUserDb = yield user_repo_1.userRepo.findOneByOrFail({ id: toUser });
                const fromUserDb = yield user_repo_1.userRepo.findOneByOrFail({ id: fromUser });
                if (id !== req.body.fromUser) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                if (price <= 0) {
                    return res.status(400).json({ data: null, message: "Сумма должна быть больше 0" });
                }
                if ((fromUserDb === null || fromUserDb === void 0 ? void 0 : fromUserDb.cash) < price) {
                    return res.status(400).json({ data: null, message: "Недостаточно денег на балансе" });
                }
                if (fromUserDb.id !== toUserDb.id) {
                    fromUserDb.cash -= price;
                    toUserDb.cash += price;
                    yield user_repo_1.userRepo.save(fromUserDb);
                    yield user_repo_1.userRepo.save(toUserDb);
                }
                const certificate = new certificate_entity_1.Certificate();
                certificate.price = price;
                certificate.fromUser = { id: fromUser };
                certificate.toUser = { id: toUser };
                const result = yield certificate_repo_1.certificateRepo.save(certificate);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new CertificateController;
