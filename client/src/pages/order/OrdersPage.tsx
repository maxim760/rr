import { Alert, Grid, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { FindUsersDto } from 'src/api/services/auth/dto'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'
import { hasOnlyData } from 'src/utils/config/config'
import { FormFields, getSchema } from 'src/utils/config/forms'
import SearchIcon from '@mui/icons-material/Search';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'src/components/ui/form/Input'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { GiftCertificate } from 'src/components/screens/certificate/dialogs/GiftCertificate'
import { useNavigate } from 'react-router-dom'
import { BalanceChip } from 'src/components/ui/BalanceChip/BalanceChip'
import { Actions } from 'src/components/ui/Actions/Actions'

import { QueryKeys } from 'src/utils/config/query/constants'
import { orderApi } from 'src/api/services/order/orderService'
import { IGoodsWithCount } from 'src/store/order/basketStore'
import { CurrencyFormatter, DateTimeFormatter } from 'src/utils/config/formatters'
import { Box } from '@mui/system'
import { ConfirmOrder } from 'src/components/screens/order/dialogs/ConfirmOrder'
import { OrderDetails } from 'src/components/screens/order/dialogs/OrderDetails'

interface IProps {
  
}


enum Dialogs {
  Details = "details",
  Confirm = "confirm"
}
type IDialog = {
  type: Dialogs,
  goods: IGoodsWithCount[],
  id: string,
  price: number
}
const queryKey = QueryKeys.HistoryOrders
export const OrdersPage: React.FC<IProps> = ({ }) => {
  const {dialog, onClose, onOpen} = useDialog<IDialog>()
  const { isLoading, data, error } = useQuery({
    queryFn: orderApi.get,
    queryKey: [queryKey],
    select: (response) => {
      console.log(response)
      return {
        ...response,
        orders: response.orders.map(item => ({
          ...item,
          goods: item.goods.reduce((acc, goodsItem) => {
            const index = acc.findIndex(item => item.item.id === goodsItem.id)
            if (index !== -1) {
              return [...acc.slice(0, index), {item: acc[index].item, count: acc[index].count + 1}, acc.slice(index + 1)] as IGoodsWithCount[]
            }
            return [...acc, {item: goodsItem, count: 1}]
          }, [] as IGoodsWithCount[])
        }))
      }
    }
  })
  return (
    <Layout title="История заказов">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <Alert sx={{mx: "auto", py: 0, px: 1, mt: 1}} variant='outlined' severity='info'>Всего потрачено: {CurrencyFormatter.format(data.totalCost)}</Alert>
          <Grid container spacing={2} sx={{mb: 2, mt: 0.5}}>
            {data.orders.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}> 
                <PropertiesCard
                  groups={[
                    {
                      id: "1",
                      title: DateTimeFormatter.format(item.created_at),
                      items: [
                        {label: "Цена", value: CurrencyFormatter.format(item.price)},
                        {label: "Статус", value: item.done ? "Выполнено" : "Не выполнено"},
                        {label: "С доставкой", value: item.withDelivery ? "Да" : "Нет"}
                      ]
                    },
                    ...(item.curier ? [{
                      id: "2",
                      title: "Курьер",
                      items: [
                        { label: "Имя", value: item.curier.name},
                        { label: "Телефон", value: item.curier.phone},
                      ]
                    }] : [])
                  ]}
                >
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {!item.done && <AppButton onClick={onOpen({type: Dialogs.Confirm, goods: item.goods, id: item.id, price: item.price})} noMargin>Подтвердить</AppButton>}
                    <AppButton onClick={onOpen({type: Dialogs.Details, goods: item.goods, id: item.id, price: item.price})} noMargin>Подробнее</AppButton>
                    
                  </Box>
                </PropertiesCard>
              </Grid>
            ))}
            {!data.orders.length && (
              <Grid item sx={{mx: "auto", mt: 4}}>
                <Typography fontWeight={400} fontSize={"1.25rem"}>Заказов еще не было</Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
      {dialog?.type === Dialogs.Confirm && <ConfirmOrder id={dialog.id} invalidateQuery={queryKey} onClose={onClose} open/>}
      {dialog?.type === Dialogs.Details && <OrderDetails totalPrice={dialog.price} goods={dialog.goods} onClose={onClose} open/>}
    </Layout>
  )
}