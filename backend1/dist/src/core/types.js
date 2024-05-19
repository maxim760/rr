"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.OrderStatus = exports.CurierStatus = void 0;
var CurierStatus;
(function (CurierStatus) {
    CurierStatus["Free"] = "free";
    CurierStatus["Busy"] = "busy";
})(CurierStatus = exports.CurierStatus || (exports.CurierStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Wait"] = "Wait";
    OrderStatus["InCurier"] = "InCurier";
    OrderStatus["Finished"] = "Finished";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "user";
    UserRole["Admin"] = "admin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
