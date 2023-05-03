export enum CurierStatus {
  Free = "free",
  Busy = "busy"
}
export enum UserRole {
  User = "user",
  Admin = "admin"
}
export type IUserPayload = {
  id: string,
  email: string,
  roles: UserRole[]
}

export type ITokens = {
  accessToken: string,
  refreshToken: string,
}

export type OmitCreateEntity<T, Fields extends string = ""> = Omit<Omit<T, Fields>, "created_at" | "updated_at" | "id">

declare global {
  namespace Express {
    interface User extends Record<string, any> {}
  }
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T
}
export interface TypedRequestParams<T> extends Express.Request {
  params: T
}

export type ControllerFn = (req: Express.Request, res: Express.Response) => void