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
const dotenv_1 = __importDefault(require("dotenv"));
const passport_jwt_1 = require("passport-jwt");
const tokens_1 = require("../utils/tokens");
const user_repo_1 = require("../../user/user.repo");
dotenv_1.default.config();
const cookieExtractor = (req) => {
    console.log("cookie extractor");
    let token = null;
    console.log("token: ", token, "!");
    if (req && req.cookies) {
        token = req.cookies['refreshToken'];
    }
    console.log("token: ", token, "!");
    return token;
};
const jwtRefreshOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};
const jwtAccessOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const applyJwtStrategy = (passport) => {
    passport.use("jwt-refresh", new passport_jwt_1.Strategy(jwtRefreshOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, email } = payload;
        console.log("jwt refresh", id, email);
        const user = yield user_repo_1.userRepo.findOne({ where: { id }, relations: { roles: true } });
        const refreshToken = user === null || user === void 0 ? void 0 : user.refreshToken;
        if (refreshToken) {
            // Проверяем валидность refresh-токена
            try {
                const payload = { id, email: user.email, roles: user.roles.map(item => item.name) };
                const newTokens = tokens_1.TokenService.generateTokens(payload);
                user.refreshToken = newTokens.refreshToken;
                yield user_repo_1.userRepo.save(user);
                done(null, { tokens: newTokens, user });
            }
            catch (err) {
                done(err);
            }
        }
        else {
            done(new Error('Refresh token not found'));
        }
    })));
    passport.use("jwt", new passport_jwt_1.Strategy(jwtAccessOptions, (payload, done) => {
        console.log("jwt", payload);
        done(null, payload);
    }));
};
exports.default = applyJwtStrategy;
