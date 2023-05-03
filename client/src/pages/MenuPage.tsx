import { Badge, Box, Fab, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { hasOnlyData } from 'src/utils/config/config'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { useMenuSearch } from 'src/utils/hooks/menu/useMenuSearch'
import { SearchBar } from 'src/components/screens/menu/SearchBar'
import { GoodsCard } from 'src/components/screens/goods/GoodsCard'
import { EditGoodsItem } from 'src/components/screens/goods/dialogs/EditGoodsItem'
import { EditDiscount } from 'src/components/screens/goods/dialogs/EditDiscount'

import { shallow } from 'zustand/shallow'
import {
  selectBasket,
  selectBasketActions,
  useBasketStore,
} from 'src/store/order/basketStore'

import MinusIcon from '@mui/icons-material/Remove'
import PlusIcon from '@mui/icons-material/Add'
import { BasketActions } from 'src/components/screens/goods/BasketActions'
import { Basket } from 'src/components/screens/goods/dialogs/Basket'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import { BalanceChip } from 'src/components/ui/BalanceChip/BalanceChip'
interface IProps {}

enum Dialogs {
  Basket = 'basket',
}
type IDialog = {
  type: Dialogs
}

export const MenuPage: React.FC<IProps> = ({}) => {
  const basket = useBasketStore(selectBasket)
  const differentPositionsLen = Object.keys(basket).length
  const actions = useBasketStore(selectBasketActions, shallow)
  const { dialog, onClose, onOpen } = useDialog<IDialog>()
  const { methods, queryData, invalidateQuery } = useMenuSearch({
    onlyActive: true,
  })
  const { isLoading, data, error, isRefetching, refetch } = queryData
  const dialogProps = {
    onClose: onClose,
    open: true,
  } as const
  return (
    <Layout title="Меню">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <SearchBar refetch={refetch} methods={methods} />
          <BalanceChip />

          <Grid
            container
            spacing={2}
            sx={{ mt: 2, alignItems: 'stretch', mb: 8 }}
          >
            {isRefetching ? (
              <Loader />
            ) : (
              <>
                {data.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <GoodsCard item={item} showCount={false}>
                      <BasketActions
                        actions={actions}
                        basketItem={basket[item.id] || null}
                        item={item}
                      />
                    </GoodsCard>
                  </Grid>
                ))}
                {!data.length && (
                  <Grid item sx={{ mx: 'auto', mt: 4 }}>
                    <Typography fontWeight={400} fontSize={'1.25rem'}>
                      Блюд не найдено
                    </Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
          <Fab
            variant="extended"
            color="secondary"
            size="medium"
            onClick={onOpen({ type: Dialogs.Basket })}
            sx={{ position: 'fixed', mr: 2, mb: 2, bottom: 0, right: 0 }}
          >
            <Badge
              badgeContent={differentPositionsLen}
              color="primary"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <ShoppingBasketIcon sx={{ mr: 1 }} />
            </Badge>
            Корзина
          </Fab>
        </>
      )}
      {dialog?.type === Dialogs.Basket && <Basket {...dialogProps} />}
    </Layout>
  )
}
