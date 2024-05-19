import { AxiosError } from "axios"

export const getBaseUrl = () => process.env.REACT_APP_SERVER_URL

export const getErrorMessage = (e: unknown, defaultMessage: string) =>
  (e as AxiosError<{ message: string }>)?.response?.data?.message || defaultMessage || "Неизвестная ошибка"
  
type IQueryData = { isLoading: boolean, error: unknown }

export const hasOnlyData = <T,>(data: T, options: IQueryData): data is NonNullable<T> => {
  const {isLoading, error} = options
  return !isLoading && !error && !!data
}