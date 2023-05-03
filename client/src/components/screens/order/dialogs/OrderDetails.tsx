import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { OrderItem } from 'src/components/ui/OrderItem/OrderItem'
import { IGoodsWithCount } from 'src/store/order/basketStore'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { DialogProps } from 'src/utils/types/types'


type IProps = {
  goods: IGoodsWithCount[],
  totalPrice: number
} & DialogProps

export const OrderDetails: FC<IProps> = ({ onClose, open, goods, totalPrice }) => {
  return (
    <AppDialog onClose={onClose} open={open} title="Детали заказа" maxWidth="sm" fullWidth>
      <Grid
        container
        spacing={1}
      >
        {goods.map((basketItem, i, arr) => {
          const { item, count } = basketItem
          return (
            <Grid item key={item.id}>
              <OrderItem
                divider={arr.length - 1 === i}
                item={item}
                count={count}
              />
            </Grid>
          )
        })}
        <Grid item xs={12}>
          <Typography fontSize="1.25rem">Итого: <b>{CurrencyFormatter.format(totalPrice)}</b></Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex">
            {!!onClose && (
              <CloseButton
                onClick={onClose}
                sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </AppDialog>
  )
}
