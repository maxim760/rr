import { yupResolver } from "@hookform/resolvers/yup"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { GetGoodsDto } from "src/api/services/goods/dto"
import { goodsApi } from "src/api/services/goods/goodsService"
import { FormFields, getSchema } from "src/utils/config/forms"
import { QueryKeys } from "src/utils/config/query/constants"

const getValidationSchema = () =>
  getSchema<GetGoodsDto>({
    query: FormFields.Str,
    min: FormFields.Number,
    max: FormFields.Number,
  })

const invalidateQuery = QueryKeys.Goods

type IOptions = {
  onlyActive?: boolean
}

export const useMenuSearch = ({onlyActive}: IOptions = {}) => {
  const methods = useForm<GetGoodsDto>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {query: "", max: undefined, min: undefined},
  })

  const {watch} = methods

  const query = watch("query")
  const min = watch("min")
  const max = watch("max")

  const queryData = useQuery({
    queryFn: () => goodsApi.get({max, min, query}),
    queryKey: [invalidateQuery],
    onError: () => toast.error("Ошибка при поиске"),
  })
  return {
    queryData,
    methods,
    invalidateQuery
  }
}