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
const passport_local_1 = require("passport-local");
const user_repo_1 = require("../../user/user.repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const applyLocalStrategy = (passport) => {
    passport.use("local", new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("local strategy");
        const user = yield user_repo_1.userRepo.findOne({ where: { email }, relations: { roles: true } });
        console.log("local strategy after find");
        if (!user) {
            console.log("not user");
            return done(null, false, { message: 'Пользователь с таким email не найден.' });
        }
        const equalsPassword = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (equalsPassword && !!(user === null || user === void 0 ? void 0 : user.password)) {
            return done(null, user);
        }
        return done(null, false, { message: 'Неправильный пароль.' });
    })));
};
exports.default = applyLocalStrategy;
