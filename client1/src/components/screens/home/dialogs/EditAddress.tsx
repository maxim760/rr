import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {FC} from 'react'
import ReactDaDataBox from 'react-dadata-box'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
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

const token = process.env.REACT_APP_API_ADDRESS_KEY || ''

const customStyles = () => ({
  'react-dadata__suggestions': {
    maxHeight: 120,
    overflowY: 'auto',
  }
})

const getValidationSchema = () => getSchema<Partial<IAddress>>({
  full_address: FormFields.RequiredStr
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
  const { handleSubmit, setValue, control, } = methods

  const onChangeAddress = (onChange: Function) => (v: any) => {
    const { city, country, street, house, geo_lat, geo_lon, flat } = v.data
    onChange(v?.value ?? "")
    setValue('city', city ?? '');
    setValue('country', country ?? '');
    setValue('street', street ?? '');
    setValue('house', house ?? '');
    setValue('latitude', geo_lat ?? '');
    setValue('longitude', geo_lon ?? '');
    setValue('flat', flat || '');
  }
  const onSubmit = (form: IAddress) => {

    const flat = +form.flat || undefined;
    const lat = +form.latitude || undefined;
    const lon = +form.longitude || undefined;

    if (!flat) {
      toast.error('Не указана квартира')
      return
    }
    if (!form.city) {
      toast.error('Не указан город')
      return
    }
    if (!form.full_address) {
      toast.error('Не указан адрес')
      return
    }
    if (!form.country) {
      toast.error('Не указана страна')
      return
    }
    if (!form.entrance) {
      toast.error('Не указан подъезд')
      return
    }
    if (!lat|| !lon) {
      toast.error('Не указана широта или долгота')
      return
    }
    if (!form.house) {
      toast.error('Не указан дом')
      return
    }
    if (!form.street) {
      toast.error('Не указана улица')
      return
    }

    mutateAsync(form)
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Изменение адреса">
      <FormProvider {...methods}>
        <Grid container component="form" spacing={2} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
        <Typography>Укажите адрес</Typography>
      </Grid>
        <Grid item sm={12} xs={12}>
        <Controller
          render={({ field: { onChange, value, onBlur, name } }) => {
            return (
              <ReactDaDataBox
              showNote={false}
                token={token}
              customStyles={customStyles() as any}
                count={10}
                onChange={onChangeAddress(onChange)}
              allowClear={false}
              autocomplete={true as any}
              placeholder="Введите адрес"
              type="address"
              customInput={(props) => {
                const { onBlur: onBlurInput, onChange: onChangeInput, ...rest } = props
                const blur = (e: any) => {
                  console.log('b')
                  onBlurInput(e as any)
                  onBlur()
                }
                const change = (...args: any[]) => {
                  console.log('c')
                  onChangeInput(args[0] as any)
                  onChange(...args)
                }
    
                return (
                  <Input
                    required={true}
                    name={"full_address"}
                    label="Адрес"
                    {...rest}
                    onBlur={blur}
                    onChange={change}
                    onKeyDown={undefined}
                    value={value}
                  />
                )
              }}
            />
            )
          }}
          name={"full_address"}
          control={control}
        />
        </Grid>
        <Grid item sm={12} xs={12}>
        <Input
          label="Подъезд"
          name="entrance"
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