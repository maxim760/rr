import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import { authApi } from 'src/api/services/auth/authService'
import { ConfirmDialog } from 'src/components/utils/dialogs/ConfirmDialog'
import { useAuthStore } from 'src/store/profile/authStore'
import { getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () =>
  getSchema<{}>({})

type IProps = {
} & DialogProps

export const ConfirmDelete: FC<IProps> = ({ onClose, open }) => {
  const clearUser = useAuthStore(state => state.clearUser)
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      onClose()
    },
  })

  const onSubmit = () => {
    mutateAsync()
    clearUser()
  }
  return (
    <ConfirmDialog
      onClose={onClose}
      open={open}
      title="Удаление аккаунта"
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
