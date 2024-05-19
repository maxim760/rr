import { getDistance } from 'geolib';
import { OrderStatus, Route, RouteData } from "../core/types"
import { Order } from "./order.entity"
import { Point, geolocation, solve } from './alg';
import { performance } from 'perf_hooks'
import { Address } from '../address/address.entity';
import { User } from '../user/user.entity';

class OrderService {
  findRoute(_orders: Order[], curierOrder?: Order): RouteData {
    const orders = curierOrder ? [curierOrder, ..._orders] : _orders;
    const start = performance.now();
    try {
      const points: Point[] = orders.map(o => ({
        type: 'Point', coordinates: [o.user.address.longitude, o.user.address.latitude]
      }));
      const costMatrix = geolocation.createCostMatrix(points);
      const solution = solve(costMatrix);

      if (!solution?.path) {
        throw new Error('');
      }

      const solutionRoute: Route[] = solution.path.map((item) => {
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
        }
      })
      
      const curierIndex = solutionRoute.findIndex((item) => item.order.id === '-1');
      const index = curierIndex === -1 ? 0 : curierIndex;

      const route = [...solutionRoute.slice(index), ...solutionRoute.slice(0, index)];  


      const end = performance.now();

      return { route: route, time: end - start, cost: solution.cost }
    } catch {
      return { route: [], time: 0, cost: 0 }
    }
  }
}

export default new OrderService()