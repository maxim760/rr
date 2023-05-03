import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {FC} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { IAddress } from 'src/api/types/models/Address'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () => getSchema<IAddress>({
  city: FormFields.RequiredStr,
  commentary: FormFields.Str,
  country: FormFields.RequiredStr,
  entrance: FormFields.RequiredStr,
  flat: FormFields.RequiredNumber,
  house: FormFields.RequiredStr,
  street: FormFields.RequiredStr
})

type IProps = {
  address: Partial<IAddress>
} & DialogProps

export const EditAddress: FC<IProps> = ({ address, onClose, open }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: authApi.editAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      onClose()
    }
  })

  const methods = useForm<IAddress>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: address
  })
  const { handleSubmit } = methods
  const onSubmit = (data: IAddress) => {
    mutateAsync(data)
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Изменения адреса">
      <FormProvider {...methods}>
        <Grid container component="form" spacing={1} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
        <Typography>Укажите адрес</Typography>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Input
          label="Страна"
            name="country"
            autoFocus
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Input
          label="Город"
          name="city"
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          label="Улица"
          name="street"
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Input
          label="Дом"
          name="house"
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Input
          label="Подъезд"
          name="entrance"
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Input
          label="Квартира"
          name="flat"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <MultilineInput
          label="Комментарий"
          name="commentary"
        />
      </Grid>
      <Grid item xs={12}>
        <Box display="flex">
          {!!onClose && <CloseButton
            onClick={onClose}
            sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
          />}
          <SaveButton
            type="submit"
            sx={{ mt: 1, mx: !onClose ? 'auto' : undefined, display: 'flex' }}
            loading={isLoading}
          />
        </Box>
      </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}