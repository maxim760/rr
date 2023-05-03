
export enum CurierStatus {
  Free = "free",
  Busy = "busy"
}

export const curierStatuses: { [key in CurierStatus]: string } = {
  [CurierStatus.Free]: "Свободен",
  [CurierStatus.Busy]: "Занят",
}

export type ICurier = {
  id: string,
  name: string,
  phone: string,
  status: CurierStatus
}

