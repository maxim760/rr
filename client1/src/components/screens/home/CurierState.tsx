import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Card,
  ClickAwayListener,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { EditUserContactDto } from 'src/api/services/auth/dto'
import { OrderStatus } from 'src/api/services/order/response'
import { IUser } from 'src/api/types/models/User'
import { OrderItem } from 'src/components/ui/OrderItem/OrderItem'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import {
  CurrencyFormatter,
  DateTimeFormatter,
} from 'src/utils/config/formatters'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'
import { ConfirmOrder } from '../order/dialogs/ConfirmOrder'
import { YMaps, Map, Polyline, Placemark, Button } from 'react-yandex-maps'
import { RouteData } from 'src/api/services/curier/response'
const getValidationSchema = () =>
  getSchema<EditUserContactDto>({
    firstName: FormFields.RequiredStr,
    lastName: FormFields.RequiredStr,
    phone: FormFields.RequiredPhone,
  })

type IProps = {
  curier: IUser['curier']
  route?: RouteData
}

function mapStatus(status: OrderStatus) {
  if (status === OrderStatus.Finished) {
    return 'Заказ выдан'
  }
  if (status === OrderStatus.InCurier) {
    return 'Заказ у курьера'
  }
  return 'Заказ в ожидании'
}

const test = [
  { latitude: 55.7445, longitude: 37.7184 },
  { latitude: 55.6817, longitude: 37.5154 },
  { latitude: 55.7262, longitude: 37.5611 },
  { latitude: 55.7709, longitude: 37.602 },
]

export const CurierState: FC<IProps> = ({ curier, route }) => {
  console.log({
    curier, route, 'После алгоритма': route?.route.map(item => ({ lat: item.client.address.latitude, lon: item.client.address.longitude })), 'Обычный порядок': curier.orders.filter(item => route?.route.find(i => i.order.id === item.id)).map(item => {
      return {
      lat: item.user.address.latitude,
      lon: item.user.address.longitude,
    }
  }) })

  const [orderId, setOrderId] = useState('')

  const [tooltipOpen, setTooltipOpen] = useState(-1)

  const handleTooltipClose = () => {
    setTooltipOpen(-1)
  }

  const handleTooltipOpen = (i: number) => {
    setTooltipOpen(i)
  }

  const selectedRoutePart = route?.route[tooltipOpen]
    ? { ...route?.route[tooltipOpen], order: curier.orders.find(item => item.id === route?.route[tooltipOpen].order.id) || route?.route[tooltipOpen].order }
    : undefined;

  return (
    <Grid
      container
      spacing={1}
      style={{ margin: '2rem auto', maxWidth: '600px' }}
    >
      <Grid item xs={12}>
        <Typography textAlign="center" variant="h4">
          Профиль курьера
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center">
          {curier.user.firstName} {curier.user.lastName}, {curier.user.phone}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center">
          Статус: {curier.status === 'busy' ? 'Занят' : 'Свободен'}
        </Typography>
      </Grid>
      {!route?.route.length && (
        <Grid item xs={12}>
          <Typography textAlign="center">Маршрута нет</Typography>
        </Grid>
      )}
      {!route?.route.length &&
        !!curier.orders.filter((item) => item.status === OrderStatus.Wait || item.status === OrderStatus.InCurier)
          .length && (
          <Grid item xs={12}>
            <Typography textAlign="center">Заказы в ожидании:</Typography>
          </Grid>
        )}
      {!route?.route.length &&
        !curier.orders.filter((item) => item.status === OrderStatus.Wait || item.status === OrderStatus.InCurier)
          .length && (
          <Grid item xs={12}>
            <Typography textAlign="center">Заказов нет</Typography>
          </Grid>
        )}

      {!route?.route.length &&
        curier.orders
          .filter((item) => item.status === OrderStatus.Wait || item.status === OrderStatus.InCurier)
          .map((item) => (
            <Grid key={item.id} item xs={12}>
              <PropertiesCard
                groups={[
                  {
                    id: '1',
                    title:
                      'Заказ от ' + DateTimeFormatter.format(item.created_at),
                    items: [
                      {
                        label: 'Цена',
                        value: CurrencyFormatter.format(item.price),
                      },
                      { label: 'Имя клиента', value: item.user.firstName },
                      { label: 'Телефон клиента', value: item.user.phone },
                      {
                        label: 'Адрес клиента',
                        value: item.user?.address?.full_address,
                      },
                    ],
                  },
                ]}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <AppButton onClick={() => setOrderId(item.id)} noMargin>
                    Подтвердить
                  </AppButton>
                </Box>
              </PropertiesCard>
            </Grid>
          ))}
      {!!route?.route.length && (
        <Grid
          item
          xs={12}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <YMaps>
            <Map
              width="100%"
              height="450px"
              defaultState={{
                center: [55.74, 37.64],
                zoom: 10,
              }}
            >
              <Polyline
                geometry={route.route.map((item) => [
                  item.client.address.latitude,
                  item.client.address.longitude,
                ])}
                options={{
                  hasBalloon: true,
                  strokeWidth: 4,
                }}
              />
              {route.route.map((item, i) => (
                <Placemark
                  key={i}
                  geometry={[
                    item.client.address.latitude,
                    item.client.address.longitude,
                  ]}
                  options={{
        preset: item.order.id === '-1' ? "islands#greenDotIcon" : undefined,
                  }}
                  onClick={() => handleTooltipOpen(i)}
                />
              ))}
            </Map>
          </YMaps>
        </Grid>
      )}
      {!!route?.time && (
        <Grid item xs={12} textAlign="center">
          Построение маршрута. Время - {parseFloat((route.time).toFixed(5))} мс.
        </Grid>
      )}
      {!!route?.route.length &&
        !!curier.orders.filter((item) => item.status === OrderStatus.Wait || item.status === OrderStatus.InCurier)
          .length && (
          <Grid item xs={12}>
            <Typography textAlign="center">Заказы в виде списка:</Typography>
          </Grid>
        )}
      {!!route?.route.length &&
        curier.orders
        .filter((item) => item.status === OrderStatus.Wait || item.status === OrderStatus.InCurier)
          .sort((a, b) => route.route.findIndex(item => item.order.id === b.id) - route.route.findIndex(item => item.order.id === a.id))
          .map((item) => (
            <Grid key={item.id} item xs={12}>
              <PropertiesCard
                groups={[
                  {
                    id: '1',
                    title:
                      'Заказ от ' + DateTimeFormatter.format(item.created_at),
                    items: [
                      {
                        label: 'Цена',
                        value: CurrencyFormatter.format(item.price),
                      },
                      { label: 'Имя клиента', value: item.user.firstName },
                      { label: 'Телефон клиента', value: item.user.phone },
                      {
                        label: 'Адрес клиента',
                        value: item.user?.address?.full_address,
                      },
                    ],
                  },
                ]}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <AppButton onClick={() => setOrderId(item.id)} noMargin>
                    Подтвердить
                  </AppButton>
                </Box>
              </PropertiesCard>
            </Grid>
          ))}

      {orderId && (
        <ConfirmOrder
          id={orderId}
          invalidateQuery={'me'}
          onClose={() => setOrderId('')}
          open
        />
      )}
      {tooltipOpen !== -1 && selectedRoutePart && (
        <AppDialog onClose={handleTooltipClose} open={true} title="Информация">
          {selectedRoutePart.order.status === OrderStatus.Finished && <h2>Заказ уже выдан</h2>}
          <PropertiesCard
            groups={[
              {
                id: '1',
                title:
                selectedRoutePart.order.created_at ? 'Заказ от ' +
                  DateTimeFormatter.format(selectedRoutePart.order.created_at) : 'Заказ',
                items: [
                  {
                    label: 'Цена',
                    value: selectedRoutePart.order.price + ' ₽',
                  },
                  {
                    label: 'Статус',
                    value: selectedRoutePart?.order?.status ? mapStatus(selectedRoutePart?.order?.status) : '-',
                  },
                  {
                    label: 'Имя клиента',
                    value: selectedRoutePart.client.name,
                  },
                  {
                    label: 'Телефон клиента',
                    value: selectedRoutePart.client.phone,
                  },
                  {
                    label: 'Адрес клиента',
                    value: selectedRoutePart.client.address?.full_name,
                  },
                ],
              },
            ]}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedRoutePart.order.status !== OrderStatus.Finished && selectedRoutePart.order.id && (
                <AppButton
                  onClick={() => {
                    const id = selectedRoutePart.order.id || '';
                    handleTooltipClose()
                    setOrderId(id)
                  }}
                  noMargin
                >
                  Подтвердить
                </AppButton>
              )}
            </Box>
          </PropertiesCard>
        </AppDialog>
      )}
    </Grid>
  )
}
