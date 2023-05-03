import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { EditUserContactDto } from 'src/api/services/auth/dto'
import { IAddress } from 'src/api/types/models/Address'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () =>
  getSchema<EditUserContactDto>({
    firstName: FormFields.RequiredStr,
    lastName: FormFields.RequiredStr,
    phone: FormFields.RequiredPhone,
  })

type IProps = {
  contact: Partial<EditUserContactDto>
} & DialogProps

export const EditContact: FC<IProps> = ({ contact, onClose, open }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: authApi.editContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      onClose()
    },
  })

  const methods = useForm<EditUserContactDto>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: contact,
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditUserContactDto) => {
    mutateAsync(data)
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Изменение профиля">
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Typography>Укажите контактные данные</Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input label="Имя" name="firstName" />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input label="Фамилия" name="lastName" />
          </Grid>
          <Grid item xs={12}>
            <PhoneInput name="phone" />
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
