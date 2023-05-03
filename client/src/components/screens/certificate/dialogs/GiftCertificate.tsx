import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from 'src/api/services/auth/authService'
import { certificateApi } from 'src/api/services/certificate/certificateService'
import { CreateCertDto } from 'src/api/services/certificate/dto'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { useAuthStore } from 'src/store/profile/authStore'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { RouterPaths } from 'src/utils/config/router'
import { DialogProps } from 'src/utils/types/types'

type CreateCertCash = Pick<CreateCertDto, "price">

const getValidationSchema = () =>
  getSchema<CreateCertCash>({
    price: FormFields.RequiredNumberPositive,
  })

type IProps = {
  toId: string
} & DialogProps

export const GiftCertificate: FC<IProps> = ({ onClose, open, toId }) => {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: certificateApi.add,
    onSuccess: () => {
      navigate(RouterPaths.Certificates)
      onClose()
    },
  })

  const methods = useForm<CreateCertCash>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {price: undefined},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: CreateCertCash) => {
    if (!user?.id) {
      toast.error("Нет id пользователя")
      return
    }
    mutateAsync({fromUser: user?.id, price: data.price, toUser: toId})
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Подарите сертификат" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Input autoFocus label="На сумму" name="price" type="number" />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              {!!onClose && (
                <CloseButton
                  onClick={onClose}
                  sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
                />
              )}
              <SaveButton
                type="submit"
                sx={{
                  mt: 1,
                  mx: !onClose ? 'auto' : undefined,
                  display: 'flex',
                }}
                loading={isLoading}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}
