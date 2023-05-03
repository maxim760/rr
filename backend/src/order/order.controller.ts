import { NextFunction, Request, Response } from "express";
import { CurierStatus, OmitCreateEntity, TypedRequestBody, UserRole } from "../core/types";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import {In} from "typeorm"
import { orderGoodsRepo, orderRepo } from "./order.repo";
import { curierRepo } from "../curier/curier.repo";
import { Order } from "./order.entity";
import { goodsRepo } from "../goods/goods.repo";
import { OrderGoods } from "./order-goods.entity";
import { Goods } from "../goods/goods.entity";

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
        relations: { curier: true, user: true, goods: true, orderToGoods: {goods: true} },
        select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true } },
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
      const item = new Order()
      item.done = !withDelivery
      item.withDelivery = withDelivery
      item.goods = []
      item.user = { id: userId } as User
      if(withDelivery) {
        totalPrice += deliveryCost;
        const curiers = await curierRepo.find({ where: { status: CurierStatus.Free }, relations: {orders: true} });
        if(!curiers.length) {
          return res.status(400).json({ message: "Нет свободных курьеров" });
        }
        const count = curiers.length;
        const randomIdx = Math.floor(Math.random() * count);
        const curier = curiers[randomIdx];
        curier.status = CurierStatus.Busy
        curier.orders ||= []
        curier.orders.push(item);
        item.curier = curier
        await curierRepo.save(curier);
      }
      if(totalPrice > currentUser.cash) {
        return res.status(400).json({ message: "Недостаточно денег на балансе" });
      }
      item.price = totalPrice
      await orderRepo.save(item)
      const orderToGoods: OrderGoods[] = []
      for (let goods of goodsFromDb) {
        const orderGoods = new OrderGoods()
        orderGoods.goods = { id: goods.id } as Goods
        orderGoods.goods_id = goods.id
        orderGoods.order = item
        orderGoods.order_id = item.id
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

  async confirmOrder(req: TypedRequestBody<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.body
      const userId  = req.user?.id || ""
      const isAdmin = (req.user?.roles || []).includes(UserRole.Admin)
      const itemFromDb = await orderRepo.findOneOrFail({ where: { id }, relations: {user: true, curier: true},select: {user: {id: true}} })
      if (itemFromDb?.user?.id !== userId && !isAdmin) {
        return res.status(403).json({ message: "Нет доступа к этой функции" })
      }
      itemFromDb.done = true
      const curier = itemFromDb.curier;
      if(curier != null) {
        curier.status = CurierStatus.Free;
        console.log("curier", curier)
        await curierRepo.save(curier)
      }
      await orderRepo.save(itemFromDb);
      console.log(itemFromDb)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }
  
}
export default new OrderController