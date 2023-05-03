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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = __importDefault(require("../../auth/auth.service"));
dotenv_1.default.config();
const applyGoogleStrategy = (passport) => {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/google/callback`,
        pkce: true,
        state: true,
        scope: ["profile", "email"],
    }, function (accessToken, refreshToken, profile, done) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                firstName: ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) || "",
                lastName: ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName) || "",
                email: profile._json.email || ""
            };
            const loginData = yield auth_service_1.default.loginAfterOauth(user);
            console.log(loginData);
            return done(null, loginData);
        });
    }));
};
exports.default = applyGoogleStrategy;
