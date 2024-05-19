"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../core/types");
const order_service_1 = __importDefault(require("./order.service"));
const point1 = { latitude: 55.6817, longitude: 37.5154 };
const point2 = { latitude: 55.779059, longitude: 37.704808 };
const point3 = { latitude: 55.805579, longitude: 37.627535 };
const point4 = { latitude: 55.7445, longitude: 37.7184 };
const point5 = { latitude: 55.792883, longitude: 37.518564 };
const pointList = [point1, point2, point3, point4, point5];
const expectedOrder = [point1, point5, point3, point2, point4];
function mapPointToOrder(point, idx) {
    return {
        created_at: new Date(),
        id: `${idx}`,
        curier: {},
        done: false,
        goods: [],
        orderToGoods: [],
        price: 1,
        status: types_1.OrderStatus.InCurier,
        timestamp: '',
        updated_at: new Date(),
        withDelivery: true,
        user: {
            firstName: '',
            phone: '',
            address: {
                full_address: '',
                latitude: point.latitude,
                longitude: point.longitude
            }
        }
    };
}
function mapRouteToPoint(order) {
    return { latitude: order.client.address.latitude, longitude: order.client.address.longitude };
}
describe('Построение маршрута', () => {
    test('Точки в правильном порядке', () => {
        expect(order_service_1.default.findRoute(pointList.map(mapPointToOrder)).route.map(mapRouteToPoint)).toEqual(expectedOrder);
    });
    test('Идет подсчет времени построения маршрута, он больше 0', () => {
        expect(order_service_1.default.findRoute(pointList.map(mapPointToOrder)).time).toBeGreaterThan(0);
    });
});
