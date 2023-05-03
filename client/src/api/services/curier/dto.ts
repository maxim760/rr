import { ICurier } from "./response";

export type CreateCurierDto = Pick<ICurier, "name" | "phone">
export type EditCurierDto = Pick<ICurier, "name" | "phone" | "id" | "status">
export type DeleteCurierDto = {curierId: string}