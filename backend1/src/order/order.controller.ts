import { NextFunction, Request, Response } from "express";
import { CurierStatus, OmitCreateEntity, OrderStatus, TypedRequestBody, UserRole } from "../core/types";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import {In} from "typeorm"
import { orderGoodsRepo, orderRepo } from "./order.repo";
import { curierRepo } from "../curier/curier.repo";
import { Order } from "./order.entity";
import { goodsRepo } from "../goods/goods.repo";
import { OrderGoods } from "./order-goods.entity";
import { Goods } from "../goods/goods.entity";
import orderService from "./order.service";

const curierAddress = {
  user: {
    address: {
      longitude: 37.480678,
      latitude: 55.663119,
      full_address: 'проспект Вернадского, 86А'
    },
    firstName: '',
    phone: '',
  },
  price: 0,
  id: '-1',
  status: OrderStatus.InCurier,
  created_at: new Date(),
  done: false,
  withDelivery: true,

} as Order;

class OrderController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {id, roles} = req.user || {}
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const isAdmin = (roles || []).includes(UserRole.Admin)
      const orders = await orderRepo.find({
        ...(isAdmin ? {} : { where: { user: {id} } }),
        relations: { curier: { user: true }, user: true, goods: true, orderToGoods: {goods: true} },
        select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true }, curier:{ user: { firstName: true, lastName: true, id: true, phone: true, email: true } } },
        order: { "created_at": "desc" },
        relationLoadStrategy: "query",
      })
      const totalCost = await orderRepo.sum("price", isAdmin ? undefined : { user: {id} })
      return res.json({
        orders,
        totalCost
      })
    } catch (error) {
      next(error)
    }
  }
  async create(req: TypedRequestBody<OmitCreateEntity<Order, "goods"> & { goods: string[], userId: string, deliveryCost: number }>, res: Response, next: NextFunction) {
    try {
      const currentUser = await userRepo.findOneByOrFail({id: req.user?.id})
      const { goods, userId, withDelivery, deliveryCost } = req.body
      if (!goods.length) {
        return res.status(400).json({ message: 'Блюд не выбрано' });
      }
      const goodsFromDbUniq = await goodsRepo.find({ where: { id: In(goods) }, relations: { products: true } })
      const goodsFromDb = goodsFromDbUniq.flatMap(item => new Array(goods.filter(id => id === item.id).length).fill("").flatMap(() => item))
      let totalPrice = goodsFromDb.reduce((acc, item) => acc + item.currentPrice, 0)
      if (totalPrice === null) {
        return res.status(400).json({ message: 'Ошибка при вычислении стоимости' });
      }
      
      const itemUser = await userRepo.findOne({ where: { id: userId }, relations: { address: true } });
      
      if (!itemUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const item = orderRepo.create();
      item.done = !withDelivery
      item.withDelivery = withDelivery
      item.goods = []
      item.user = itemUser;
      item.status = OrderStatus.Wait;
      item.timestamp = new Date().toISOString();
      if (withDelivery) {
        totalPrice += deliveryCost;
      }
      if(totalPrice > currentUser.cash) {
        return res.status(400).json({ message: "Недостаточно денег на балансе" });
      }
      item.price = totalPrice
      if(withDelivery) {
        const curiers = await curierRepo.find({ where: { status: CurierStatus.Free }, relations: {orders: { user: { address: true } }} });
        if(!curiers.length) {
          return res.status(400).json({ message: "Нет свободных курьеров" });
        }
        const savedItem = await orderRepo.save(item);

        const count = curiers.length;
        const randomIdx = Math.floor(Math.random() * count);
        const randomCurier = curiers[randomIdx];
        const idxCuriesWithOrders = curiers.findIndex((c) => c.orders.filter(o => !o.done));
        const curier = idxCuriesWithOrders === -1 ? randomCurier : curiers[idxCuriesWithOrders];
        curier.orders ||= []
        curier.orders.push(item);
        item.curier = curier;
        await curierRepo.save(curier);
        console.log("save");
        console.log(curier.orders.filter(o => o.status === OrderStatus.Wait))
        console.log(curier.orders.filter(o => o.status === OrderStatus.Wait).length, 'lenght')

        if (curier.orders.filter(o => o.status === OrderStatus.Wait).length >= 5) {
          console.log("in if")
          for (let i = 0; i < curier.orders.length; i++) {
            const order = curier.orders[i];
            if (order.status === OrderStatus.Wait) {
              order.status = OrderStatus.InCurier;
              await orderRepo.save(order)
            }
          }
          curier.status = CurierStatus.Busy
          curier.route = orderService.findRoute(curier.orders.filter(o => o.status === OrderStatus.InCurier || item.id === o.id).map((i) => i.id === item.id ? savedItem : i), curierAddress);
          console.log(curier.route)
          await curierRepo.save(curier);
        } else {
          setTimeout(async () => {
            try {
              const sameCurier = await curierRepo.findOne({ where: { id: curier.id }, relations: { orders: { user: {address: true } } } });
              if (sameCurier?.status === CurierStatus.Free && sameCurier.orders.find(o => o.timestamp && o.timestamp === item.timestamp)?.status === OrderStatus.Wait) {
                for (let i = 0; i < curier.orders.length; i++) {
                  const order = curier.orders[i];
                  if (order.status === OrderStatus.Wait) {
                    order.status = OrderStatus.InCurier;
                    await orderRepo.save(order)
                  }
                }
                curier.status = CurierStatus.Busy;
                curier.route = orderService.findRoute(curier.orders.filter(o => o.status === OrderStatus.InCurier || item.id === o.id), curierAddress);
                await curierRepo.save(curier);
              }
            } catch {
              console.log("timer error")
            }
          }, 1000 * 60 * 15)
        }
      }
      await orderRepo.save(item)
      const orderToGoods: OrderGoods[] = []
      for (let goods of goodsFromDb) {
        const orderGoods = new OrderGoods()
        orderGoods.goods = goods as Goods
        orderGoods.goodsId = goods.id;
        orderGoods.order = item
        orderGoods.orderId = item.id
        orderToGoods.push(orderGoods)
      }
      await orderGoodsRepo.save(orderToGoods)
      item.orderToGoods = orderToGoods
      console.log(orderToGoods.map(item => item.orderToGoodsId))
      currentUser.cash -= totalPrice
      item.goods = goodsFromDb
      await userRepo.save(currentUser)
      const result = await orderRepo.save(item)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
// todo при конфирме делать invalidate для me запроса
  async confirmOrder(req: TypedRequestBody<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.body
      const userId  = req.user?.id || ""
      const isAdmin = (req.user?.roles || []).includes(UserRole.Admin)
      const itemFromDb = await orderRepo.findOneOrFail({ where: { id }, relations: {user: true, curier: { user: { address: true }, orders: true }} })

      itemFromDb.done = true
      itemFromDb.status = OrderStatus.Finished;
      const curier = itemFromDb.curier;
      if(curier != null && curier.orders.every(order => order.id === itemFromDb.id || order.status !== OrderStatus.InCurier)) {
        curier.status = CurierStatus.Free;
        curier.route = null
        await curierRepo.save(curier)
      }
      await orderRepo.save(itemFromDb);
      console.log(itemFromDb)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }

  // todo конфирм теперь может делать курьер, учесть;
  
}
export default new OrderController