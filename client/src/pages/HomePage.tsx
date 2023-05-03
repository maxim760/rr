import {
  Box,
  colors,
  darken,
  SpeedDial,
  SpeedDialAction,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'
import { authApi } from 'src/api/services/auth/authService'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/AddCircle'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { EditAddress } from 'src/components/screens/home/dialogs/EditAddress'
import { EditContact } from 'src/components/screens/home/dialogs/EditContact'
import { EditBalance } from 'src/components/screens/home/dialogs/EditBalance'
import { ConfirmDelete } from 'src/components/screens/home/dialogs/ConfirmDelete'
import { CurrencyFormatter, DateTimeFormatter } from 'src/utils/config/formatters'
import { Loader } from 'src/components/ui/statuses/Loader'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { hasOnlyData } from 'src/utils/config/config'
import { BalanceChip } from 'src/components/ui/BalanceChip/BalanceChip'
import { getPrintRole } from 'src/utils/functions/user'
import { toast } from 'react-toastify'
import { useAuthStore } from 'src/store/profile/authStore'
interface IProps {}

enum HomeDialogs {
  Balance,
  Address,
  Contact,
  Delete,
}

export const HomePage: React.FC<IProps> = ({ }) => {
  const setUser = useAuthStore(state => state.setUser)
  const { isLoading, data, error } = useQuery({
    queryFn: authApi.me,
    queryKey: ['me'],
    onSuccess: (res) => setUser(res)
  })
  const { dialog, onClose, onOpen } = useDialog<HomeDialogs>()
  const userCardData = useMemo(() => {
    if (!data) {
      return []
    }
    return [
      {
        id: '1',
        title: 'Личные данные',
        items: [
          { label: 'Имя', value: data.firstName },
          { label: 'Фамилия', value: data.lastName },
          { label: 'Почта', value: data.email },
          { label: 'Телефон', value: data.phone },
        ],
      },
      {
        id: '2',
        title: 'Информация об адресе',
        items: [
          { label: 'Страна', value: data.address.country },
          { label: 'Город', value: data.address.city },
          { label: 'Улица', value: data.address.street },
          { label: 'Дом', value: data.address.house },
          { label: 'Подъезд', value: data.address.entrance },
          { label: 'Квартира', value: data.address.flat },
          { label: 'Комментарий', value: data.address.commentary },
        ],
      },
      {
        id: '3',
        title: 'Дата регистрации',
        items: [
          {
            label: 'Зарегистрирован',
            value: DateTimeFormatter.format(new Date(data.created_at), {
              full: true,
            }),
          },
        ],
      },
      {
        id: '4',
        title: 'Дополнительно',
        items: [
          {
            label: 'Роль',
            value: getPrintRole(data.roles),
          },
        ],
      },
    ]
  }, [data])
  return (
    <Layout title="Профиль">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <BalanceChip onClick={onOpen(HomeDialogs.Balance)} />

          <Box
            maxWidth="sm"
            sx={{ display: 'flex', mx: 'auto', mt: '30px', mb: '75px' }}
          >
            <PropertiesCard
              sx={{ width: '100%' }}
              title="Профиль"
              groups={userCardData}
            />
          </Box>
          <SpeedDial
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              color: 'secondary',
            }}
            icon={<MoreHorizIcon />}
            ariaLabel="user profile actions"
            FabProps={{ color: 'secondary' }}
          >
            <SpeedDialAction
              icon={<CloseIcon />}
              sx={(theme) => ({
                bgcolor: theme.palette.error.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: darken(theme.palette.error.main, 0.1),
                },
              })}
              tooltipTitle="Удалить аккаунт"
              color="inherit"
              onClick={onOpen(HomeDialogs.Delete)}
            />
            <SpeedDialAction
              icon={<LocationOnIcon />}
              sx={(theme) => ({
                bgcolor: colors.orange[700],
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: darken(colors.orange[700], 0.1),
                },
              })}
              onClick={onOpen(HomeDialogs.Address)}
              tooltipTitle="Редактировать адрес"
              color="default"
            />
            <SpeedDialAction
              icon={<WalletIcon />}
              sx={(theme) => ({
                bgcolor: colors.green[500],
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: darken(colors.green[500], 0.1),
                },
              })}
              onClick={onOpen(HomeDialogs.Balance)}
              tooltipTitle="Пополнить баланс"
              color="default"
            />
            <SpeedDialAction
              icon={<EditIcon />}
              sx={(theme) => ({
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: darken(theme.palette.primary.main, 0.1),
                },
              })}
              onClick={onOpen(HomeDialogs.Contact)}
              tooltipTitle="Редактировать основную информацию"
            />
          </SpeedDial>
        </>
      )}
      {dialog === HomeDialogs.Address && (
        <EditAddress
          onClose={onClose}
          open
          address={{
            city: data?.address.city || '',
            commentary: data?.address.commentary || '',
            country: data?.address.country || '',
            entrance: data?.address.entrance || '',
            flat: data?.address.flat,
            house: data?.address.house || '',
            street: data?.address.street || '',
          }}
        />
      )}
      {dialog === HomeDialogs.Contact && (
        <EditContact
          onClose={onClose}
          open
          contact={{
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            phone: data?.phone || '',
          }}
        />
      )}
      {dialog === HomeDialogs.Balance && <EditBalance onClose={onClose} open />}
      {dialog === HomeDialogs.Delete && (
        <ConfirmDelete onClose={onClose} open />
      )}
    </Layout>
  )
}
