import { IUser } from "src/api/types/models/User";
import { ICurier } from "./response";

export type CreateCurierDto = {firstName: string, lastName: string, phone: string,  email: string, password: string}
export type EditCurierDto = {firstName: string, lastName: string, phone: string, status: ICurier["status"], id: string}
export type DeleteCurierDto = {curierId: string}