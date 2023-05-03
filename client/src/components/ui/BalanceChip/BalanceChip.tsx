import {FC} from 'react'
import { useAuthStore } from 'src/store/profile/authStore'
import {
  Box,
  Chip,
  colors,
  darken,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import AddIcon from '@mui/icons-material/AddCircle'

type IProps = {
  onClick?: () => void
}

export const BalanceChip: FC<IProps> = ({onClick}) => {
  const balance = useAuthStore(state => state.user?.cash || 0)
  return (
    <Chip
      component="div"
      size="medium"
      sx={{
        padding: '4px 4px',
        userSelect: 'auto',
        borderRadius: '32px',
        height: 'auto',
        fontSize: '18px',
        '& .MuiChip-deleteIcon': { fontSize: '32px' },
      }}
      deleteIcon={!!onClick ? (
        <AddIcon
          sx={{
            fill: colors.green[500],
            '&:hover': { fill: darken(colors.green[500], 0.1) },
          }}
        />
      ) : undefined}
      onDelete={onClick}
      label={`Баланс - ${CurrencyFormatter.format(balance)}`}
    />
  )
}