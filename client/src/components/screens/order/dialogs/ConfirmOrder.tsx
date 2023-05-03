import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { curierApi } from 'src/api/services/curier/curierService'
import { orderApi } from 'src/api/services/order/orderService'
import { ConfirmDialog } from 'src/components/utils/dialogs/ConfirmDialog'
import { getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

type IProps = {
  id: string,
  invalidateQuery: string
} & DialogProps

export const ConfirmOrder: FC<IProps> = ({ onClose, open, id, invalidateQuery }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: orderApi.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const onSubmit = () => {
    mutateAsync({id})
  }
  return (
    <ConfirmDialog
      onClose={onClose}
      open={open}
      title="Подтверждение"
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
