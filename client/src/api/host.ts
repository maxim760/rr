import axios from "axios"
import { getBaseUrl } from "src/utils/config/config"
import { tokenService } from "src/utils/config/tokens"
import { AuthResponse } from "./types/response/AuthResponse"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${tokenService.getAccessToken()}`
  return config;
})

api.interceptors.response.use((config) => {
  return config;
},async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && error.config && !error.config._isRetry && !error.response?.data?.login) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get<AuthResponse>(`${getBaseUrl()}/auth/refresh`, {withCredentials: true})
      tokenService.setAccessToken(response.data.accessToken)
      return api.request(originalRequest);
    } catch (e) {
      console.log("no auth", e)
    }
  }
  throw error;
})

export {api}