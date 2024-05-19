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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../core/types");
const role_repo_1 = require("../role/role.repo");
const user_repo_1 = require("../user/user.repo");
const curier_repo_1 = require("./curier.repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const address_repo_1 = require("../address/address.repo");
function createUser(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, firstName, lastName, password, phone } = opts;
            const userWithEmail = yield user_repo_1.userRepo.findOneBy({ email: email });
            if (userWithEmail) {
                return { message: "Пользователь с таким email уже существует" };
            }
            console.log({ email, firstName, lastName, phone });
            const user = user_repo_1.userRepo.create({ firstName, lastName, phone, email });
            user.cash = 0;
            const roles = [];
            let userRole = yield role_repo_1.roleRepo.findOneBy({ name: types_1.UserRole.User });
            if (!userRole) {
                userRole = role_repo_1.roleRepo.create({ name: types_1.UserRole.User });
                yield role_repo_1.roleRepo.save(userRole);
            }
            roles.push(userRole);
            user.roles = roles;
            if (!password) {
                return { message: "Укажите пароль" };
            }
            else {
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPass = yield bcrypt_1.default.hash(password, salt);
                user.password = hashedPass;
            }
            const address = address_repo_1.addressRepo.create(curierAddress);
            yield address_repo_1.addressRepo.save(address);
            user.address = address;
            yield user_repo_1.userRepo.save(user);
            return { user };
        }
        catch (e) {
            return { message: 'Неизвестная ошибка' };
        }
    });
}
const curierAddress = {
    city: 'Москва',
    commentary: '',
    country: 'Россия',
    entrance: '1',
    flat: 1,
    house: '11',
    latitude: 55.68171,
    longitude: 37.51540,
    street: 'Проспект Вернадского',
    full_address: 'Москва, Проспект Вернадского, 1, 11',
};
class CurierController {
    getAll(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const result = yield curier_repo_1.curierRepo.find({ relations: { user: true } });
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
                const { id, firstName, lastName, phone, status } = req.body;
                if (!status) {
                    return res.status(400).json({ message: "Статус не указан" });
                }
                const curierItemFromDb = yield curier_repo_1.curierRepo.findOneOrFail({ where: { id }, relations: { user: true } });
                curierItemFromDb.user.firstName = firstName;
                curierItemFromDb.user.lastName = lastName;
                curierItemFromDb.user.phone = phone;
                curierItemFromDb.status = status;
                yield user_repo_1.userRepo.save(curierItemFromDb.user);
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
                const userData = req.body;
                const createUserRes = yield createUser(userData);
                if ('message' in createUserRes) {
                    console.log('1');
                    return res.status(400).json({ message: createUserRes.message });
                }
                console.log('2');
                const user = createUserRes.user;
                const curier = curier_repo_1.curierRepo.create({ status: types_1.CurierStatus.Free, orders: [], name: '', phone: '' });
                console.log('3');
                yield curier_repo_1.curierRepo.save(curier);
                console.log('4');
                user.curier = curier;
                yield user_repo_1.userRepo.save(user);
                console.log('5');
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
