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
const passport_slack_oauth2_1 = require("passport-slack-oauth2");
const auth_service_1 = __importDefault(require("../../auth/auth.service"));
dotenv_1.default.config();
const applySlackStrategy = (passport) => {
    passport.use("slack", new passport_slack_oauth2_1.Strategy({
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/slack/callback`,
        skipUserProfile: false,
        scope: ['identity.basic', 'identity.email', 'identity.avatar'],
        pkce: true,
        state: true,
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = (profile === null || profile === void 0 ? void 0 : profile.user) || {};
            const user = {
                firstName: (userData === null || userData === void 0 ? void 0 : userData.name) || "",
                email: (userData === null || userData === void 0 ? void 0 : userData.email) || "",
            };
            const loginData = yield auth_service_1.default.loginAfterOauth(user);
            return done(null, loginData);
        });
    }));
};
exports.default = applySlackStrategy;
