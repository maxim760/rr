"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStrategies = void 0;
const user_repo_1 = require("../../user/user.repo");
const jwt_1 = __importDefault(require("./jwt"));
const local_1 = __importDefault(require("./local"));
const yandex_1 = __importDefault(require("./yandex"));
const applyStrategies = (passport) => {
    (0, yandex_1.default)(passport);
    (0, jwt_1.default)(passport);
    (0, local_1.default)(passport);
    passport.serializeUser(function (user, done) {
        console.log("serialize");
        done(null, { id: user.id });
    });
    passport.deserializeUser(function (id, done) {
        console.log("deserializez", id);
        try {
            const user = user_repo_1.userRepo.findOneOrFail({ where: { id }, relations: { roles: true } });
            done(null, user);
        }
        catch (e) {
            console.log(e);
            done(e);
        }
    });
};
exports.applyStrategies = applyStrategies;
