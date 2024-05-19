import { IOrderData, IOrderItem } from "../order/response"

export enum CurierStatus {
  Free = "free",
  Busy = "busy"
}

export const curierStatuses: { [key in CurierStatus]: string } = {
  [CurierStatus.Free]: "Свободен",
  [CurierStatus.Busy]: "Занят",
}

export type RouteData = {
  route: Route[],
  cost: number,
  time: number
}

export type Route = {
  client: {
    phone: string,
    name: string,
    address: {
      full_name: string,
      latitude: number,
      longitude: number,
    }
  },
  order: Partial<IOrderItem>,
}

export type ICurier = {
  id: string,
  status: CurierStatus;
  route?: RouteData;
}

