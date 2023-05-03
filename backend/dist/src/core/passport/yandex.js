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
const passport_yandex_1 = require("passport-yandex");
const auth_service_1 = __importDefault(require("../../auth/auth.service"));
dotenv_1.default.config();
const applyYandexStrategy = (passport) => {
    passport.use(new passport_yandex_1.Strategy({
        clientID: process.env.YA_CLIENT_ID,
        clientSecret: process.env.YA_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/yandex/callback`,
        // @ts-ignore
        pkce: true,
        // @ts-ignore
        state: true,
    }, function (accessToken, refreshToken, params, profile, done) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const json = (profile === null || profile === void 0 ? void 0 : profile._json) || {};
            const user = {
                firstName: (json === null || json === void 0 ? void 0 : json.first_name) || "",
                lastName: (json === null || json === void 0 ? void 0 : json.last_name) || "",
                email: (json === null || json === void 0 ? void 0 : json.default_email) || "",
                phone: ((_a = json === null || json === void 0 ? void 0 : json.default_phone) === null || _a === void 0 ? void 0 : _a.number) || ""
            };
            const loginData = yield auth_service_1.default.loginAfterOauth(user);
            return done(null, loginData);
        });
    }));
};
exports.default = applyYandexStrategy;
