"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (roleData) => {
    const roles = Array.isArray(roleData) ? roleData : [roleData];
    return (req, res, next) => {
        var _a;
        if (req.method === "OPTIONS") {
            next();
            return;
        }
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles) {
            const hasRole = req.user.roles.some((role) => roles.includes(role));
            if (hasRole) {
                next();
                return;
            }
        }
        return res.status(403).json({ message: "Доступ запрещен" });
    };
};
exports.requireRole = requireRole;
