import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { curierApi } from 'src/api/services/curier/curierService'
import { CreateCurierDto } from 'src/api/services/curier/dto'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () =>
  getSchema<CreateCurierDto>({
    firstName: FormFields.RequiredStr,
    lastName: FormFields.RequiredStr,
    phone: FormFields.RequiredPhone,
    email: FormFields.RequiredEmail,
    password: FormFields.RepeatPassword,
  })

type IProps = {
  invalidateQuery: string
} & DialogProps

export const CreateCurier: FC<IProps> = ({ onClose, open, invalidateQuery }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: curierApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })

  const methods = useForm<CreateCurierDto>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {phone: "", email: "", firstName: '', lastName: '', password: ''},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: CreateCurierDto) => {
    mutateAsync(data)
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Добавьте курьера" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Input autoFocus label="Имя" name="firstName" />
          </Grid>
          <Grid item xs={12}>
            <Input  label="Фамилия" name="lastName" />
          </Grid>
          <Grid item xs={12}>
            <Input type='email' label="Почта" name="email" />
          </Grid>
          <Grid item xs={12}>
            <Input label="Пароль" name="password" />
          </Grid>
          <Grid item xs={12}>
            <PhoneInput name='phone'  />
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
