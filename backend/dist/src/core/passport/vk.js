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
const passport_vkontakte_1 = require("passport-vkontakte");
const auth_service_1 = __importDefault(require("../../auth/auth.service"));
dotenv_1.default.config();
const applyVkStrategy = (passport) => {
    passport.use(new passport_vkontakte_1.Strategy({
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/vk/callback`,
        lang: "ru",
        apiVersion: "5.131",
    }, function (accessToken, refreshToken, params, profile, done, ...all) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                firstName: ((_a = profile._json) === null || _a === void 0 ? void 0 : _a.first_name) || "",
                lastName: ((_b = profile._json) === null || _b === void 0 ? void 0 : _b.last_name) || "",
                email: ((_d = (_c = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || "",
            };
            const loginData = yield auth_service_1.default.loginAfterOauth(user);
            return done(null, loginData);
        });
    }));
};
exports.default = applyVkStrategy;
