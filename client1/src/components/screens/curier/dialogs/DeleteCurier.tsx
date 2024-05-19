import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { curierApi } from 'src/api/services/curier/curierService'
import { ConfirmDialog } from 'src/components/utils/dialogs/ConfirmDialog'
import { getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

type IProps = {
  id: string,
  invalidateQuery: string
} & DialogProps

export const DeleteCurier: FC<IProps> = ({ onClose, open, id, invalidateQuery }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: curierApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const onSubmit = () => {
    mutateAsync({curierId: id})
  }
  return (
    <ConfirmDialog
      onClose={onClose}
      open={open}
      title="Удаление курьера"
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
