"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alg_1 = require("./alg");
const perf_hooks_1 = require("perf_hooks");
class OrderService {
    findRoute(_orders, curierOrder) {
        const orders = curierOrder ? [curierOrder, ..._orders] : _orders;
        const start = perf_hooks_1.performance.now();
        try {
            const points = orders.map(o => ({
                type: 'Point', coordinates: [o.user.address.longitude, o.user.address.latitude]
            }));
            const costMatrix = alg_1.geolocation.createCostMatrix(points);
            const solution = (0, alg_1.solve)(costMatrix);
            if (!(solution === null || solution === void 0 ? void 0 : solution.path)) {
                throw new Error('');
            }
            const solutionRoute = solution.path.map((item) => {
                const index = item[0];
                const order = orders[index];
                return {
                    client: {
                        address: {
                            full_name: order.user.address.full_address,
                            latitude: order.user.address.latitude,
                            longitude: order.user.address.longitude,
                        },
                        name: order.user.firstName,
                        phone: order.user.phone,
                    },
                    order: {
                        created_at: order.created_at,
                        done: order.done,
                        id: order.id,
                        status: order.status,
                        price: order.price,
                        withDelivery: order.withDelivery,
                    },
                };
            });
            const curierIndex = solutionRoute.findIndex((item) => item.order.id === '-1');
            const index = curierIndex === -1 ? 0 : curierIndex;
            const route = [...solutionRoute.slice(index), ...solutionRoute.slice(0, index)];
            const end = perf_hooks_1.performance.now();
            return { route: route, time: end - start, cost: solution.cost };
        }
        catch (_a) {
            return { route: [], time: 0, cost: 0 };
        }
    }
}
exports.default = new OrderService();
