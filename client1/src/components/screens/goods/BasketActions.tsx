import {FC} from 'react'
import { IGoods, IGoodsItem } from 'src/api/services/goods/response'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { IGoodsWithCount, selectBasketActions } from 'src/store/order/basketStore'
import MinusIcon from '@mui/icons-material/Remove';
import PlusIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
type IProps = {
  basketItem: IGoodsWithCount | null,
  item: IGoodsItem,
  actions: ReturnType<typeof selectBasketActions>
}

export const BasketActions: FC<IProps> = ({ basketItem, item, actions }) => {
  const onClickAdd = () => actions.addItem(item)
  const onClickPlus = () => actions.plusItem(item.id)
  const onClickMinus = () => actions.minusItem(item.id)
  if (!basketItem) {
    return (
      <AppButton
        size="small"
        noMargin
        onClick={onClickAdd}
        sx={{ alignSelf: "flex-start" }}
        type="button"
      >
        В корзину
      </AppButton>
    )
  }
  return (
    <Box sx={{display: "flex", alignItems: "center"}}>
      <AppButton sx={{borderRadius: 2, minWidth: 0, px: 0.5, py: 0.25}} noMargin variant="outlined" size="small" onClick={onClickMinus} type="button">
        <MinusIcon />
      </AppButton>
      <Typography fontSize="0.875rem" sx={{mx: 0.75}}>{basketItem.count} шт.</Typography>
      <AppButton sx={{borderRadius: 2, minWidth: 0, px: 0.5, py: 0.25}} noMargin variant="outlined" size="small" onClick={onClickPlus} type="button">
        <PlusIcon />
      </AppButton>
    </Box>
  )
}