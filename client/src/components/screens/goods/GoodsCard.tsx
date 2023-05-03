import { Box, Typography } from '@mui/material'
import {FC} from 'react'
import { IGoodsResponse } from 'src/api/services/goods/response'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { FCWithChildren } from 'src/utils/types/types'

type IProps = {
  item: IGoodsResponse,
  showCount: boolean,
}

export const GoodsCard: FCWithChildren<IProps> = ({item, children, showCount}) => {
  
  return (
    <PropertiesCard
      small
      img={{
        alt: item.name,
        src: item.img,
        type: "equal"
      }}
      sx={{height: "100%"}}
      message={(
        <Box>
          {item.left < 10 && <Typography sx={{ fontSize: "0.75rem", color: "error.main", mt: 1 }}>{
            item.left
              ? "Скоро закончится"
              : "Закончилось"
          }</Typography>}
          <Typography fontSize={"0.8rem"} sx={{mt: 0.5, textAlign: "center"  }}>{item.description}</Typography>
          {item.price === item.currentPrice ? (
            <Typography sx={{mt: 1}} fontSize={"1.25rem"} fontWeight={600}>{CurrencyFormatter.format(item.price)}</Typography>
          ) : (
            <Box sx={{ display: "flex", mt: 1, alignItems: "flex-end", gap: 1 }}>
              <Typography fontWeight={600} fontSize={"1.25rem"} sx={{py: 0, px: 1, borderRadius: 2, bgcolor: "success.light", color: "background.paper"}}>{CurrencyFormatter.format(item.currentPrice)}</Typography>
                <Typography component="del" sx={{
                textDecoration: "line-through",
                textDecorationColor: t => t.palette.error.main,
                color: "#b4b4b4"
              }}>{CurrencyFormatter.format(item.price)}</Typography>
                <Typography sx={{
                  p: 0.5,
                  borderRadius: 2,
                  fontSize: "0.8rem",
                  bgcolor: "secondary.main",
                  color: "background.paper"
              }}>-{item.discount}%</Typography>

            </Box>
          )}
        </Box>
      )}
      title={item.name}
      groups={[
        {
          id: item.id,
          items: [
            { label: "Тип", value: item.goodsType },
            ...(showCount ? [{label: "Осталось", value: item.left}] : [])
          ]
        }
      ]}
    >
      {children}
    </PropertiesCard>
  )
}