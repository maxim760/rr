import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CreateGoodsDto } from 'src/api/services/goods/dto'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { CreateOrderDto } from 'src/api/services/order/dto'
import { orderApi } from 'src/api/services/order/orderService'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { CheckboxInput } from 'src/components/ui/form/CheckboxInput'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { OrderItem } from 'src/components/ui/OrderItem/OrderItem'
import { selectBasket, selectBasketActions, selectBasketTotal, useBasketStore } from 'src/store/order/basketStore'
import { useAuthStore } from 'src/store/profile/authStore'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { RouterPaths } from 'src/utils/config/router'
import { DialogProps, IComplete } from 'src/utils/types/types'
import { BasketActions } from '../BasketActions'
const deliveryCost = +process.env.REACT_APP_DELIVERY_COST

type IOrderSchema = Pick<CreateOrderDto, "withDelivery">

const getValidationSchema = () =>
  getSchema<IOrderSchema>({
    withDelivery: FormFields.Boolean,
  })


type IProps = {
} & DialogProps

export const Basket: FC<IProps> = ({ onClose, open }) => {
  const navigate = useNavigate()
  const methods = useForm<IOrderSchema>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {withDelivery: true},
  })
  const { handleSubmit, watch } = methods
  const watchWithDelivery = watch("withDelivery")
  const userId = useAuthStore(state => state.user?.id || "")
  const basket = useBasketStore(selectBasket)
  const totalPrice = useBasketStore(selectBasketTotal)
  const actions = useBasketStore(selectBasketActions)
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      onClose()
      navigate(RouterPaths.OrderHistory)
      actions.clear()
    },
  })

  const onSubmit = (data: IOrderSchema) => {
    const goods = Object.values(basket).reduce((acc, value): string[] => {
      return [...acc, ...Array.from({length: value.count}, () => value.item.id)]
    }, [] as string[])
    mutateAsync({...data, deliveryCost, userId, goods})
  }
  const priceWithDelivery = totalPrice + (watchWithDelivery ? deliveryCost : 0)
  return (
    <AppDialog onClose={onClose} open={open} title="Корзина" maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          spacing={1}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {Object.values(basket).map((basketItem, i, arr) => {
            const { item, count } = basketItem
            return (
              <Grid item key={item.id}>
                <OrderItem
                  divider={arr.length - 1 === i}
                  item={item}
                  count={count}
                >
                  <BasketActions actions={actions} basketItem={basketItem} item={basketItem.item} />
                </OrderItem>
              </Grid>
            )
          })}

          <Grid item xs={12}>
            <CheckboxInput disabled label={`Доставка (${CurrencyFormatter.format(deliveryCost)})`} name={"withDelivery"} />
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize="1.25rem">Итого: <b>{CurrencyFormatter.format(priceWithDelivery)}</b></Typography>
          </Grid>
          <Grid item xs={12}>
              <Box display="flex">
                {!!onClose && (
                  <CloseButton
                    onClick={onClose}
                    sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
                  />
                )}
                <SaveButton
                  type="submit"
                  sx={{
                    mt: 1,
                    mx: !onClose ? 'auto' : undefined,
                    display: 'flex',
                  }}
                  disabled={!Object.keys(basket).length}
                  loading={isLoading}
                />
              </Box>
            </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}
