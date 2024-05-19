import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { CreateCertDto } from "./dto";
import { IUserCertificates } from "./response";

class CertificateApi {
  static path(nextPath: string) {
    return "/certificate" + nextPath
  }
  async add(dto: CreateCertDto) {
    const { data } = await api.post<DefaultSuccessResponse>(CertificateApi.path("/add"), dto)
    return data
  }
  async get() {
    const { data } = await api.get<IUserCertificates>(CertificateApi.path("/"))
    return data
  }
}

export const certificateApi = new CertificateApi()