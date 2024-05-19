import { Box, Typography } from '@mui/material'
import {FC} from 'react'
import { IGoods, IGoodsItem } from 'src/api/services/goods/response'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { FCWithChildren } from 'src/utils/types/types'

type IProps = {
  divider: boolean,
  count: number,
  item: IGoodsItem
}

export const OrderItem: FCWithChildren<IProps> = ({divider, count, item, children}) => {
  
  return (
    <Box sx={{px: 2, py: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid", borderColor: !divider ? "transparent" : "divider"}}>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexDirection: {xs: "column", sm: "row"} }}>
        <Box sx={{
          mr: 2,
          display: "flex",
          alignItems: "center",
          "& img": {
            aspectRatio: "1",
            height: 60,
            width: 60,
            borderRadius: 1
        }}}>
          <img src={item.img} alt={item.name} width={60} height={60}  />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontSize="1rem">{item.name}</Typography>
          <Typography fontSize="0.75rem" sx={{
            color: "text.secondary",
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical"
          }}>{item.description}</Typography>
        </Box>
        <Box>
          <Typography fontSize="1.125rem" fontWeight={600}>{CurrencyFormatter.format(item.currentPrice * count)}</Typography>
          {count > 1 && <Typography fontSize="0.75rem" sx={{color: "text.secondary"}}>{CurrencyFormatter.format(item.currentPrice)} / шт.</Typography>}
        </Box>
      </Box>
      {children}
    </Box>
  )
}