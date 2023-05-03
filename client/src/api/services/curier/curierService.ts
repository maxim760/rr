import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { IUserCertificates } from "../certificate/response";
import { CreateCurierDto, DeleteCurierDto, EditCurierDto } from "./dto";
import { ICurier } from "./response";

class CurierApi {
  static path(nextPath: string) {
    return "/curier" + nextPath
  }
  async create(dto: CreateCurierDto) {
    const { data } = await api.post<DefaultSuccessResponse>(CurierApi.path("/create"), dto)
    return data
  }
  async get() {
    const { data } = await api.get<ICurier[]>(CurierApi.path("/"))
    return data
  }
  async edit(dto: EditCurierDto) {
    const { data } = await api.put<DefaultSuccessResponse>(CurierApi.path("/edit"), dto)
    return data
  }
  async delete(dto: DeleteCurierDto) {
    const { data } = await api.delete<DefaultSuccessResponse>(CurierApi.path(`/${dto.curierId}`))
    return data
  }
}

export const curierApi = new CurierApi()