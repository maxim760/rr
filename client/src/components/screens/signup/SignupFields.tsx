import { Grid, Typography, TextField, Button, IconButton, Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FC, useEffect } from 'react'
import NumberFormat, { NumberFormatValues , } from 'react-number-format'

import {yupResolver} from "@hookform/resolvers/yup"
import { useForm, Controller, ControllerRenderProps, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { usePassword } from 'src/utils/hooks/common/usePassword';
import { IAddress } from 'src/api/types/models/Address';
import { useMutation } from '@tanstack/react-query';
import { authApi } from 'src/api/services/auth/authService'
import { useNavigate } from 'react-router-dom'
import { FormFields, FormMessages, PASS_MAX, PASS_MIN, PHONE_LENGTH } from 'src/utils/config/forms'
import { useAuthStore } from 'src/store/profile/authStore'
import { tokenService } from 'src/utils/config/tokens'
import { getPhoneNum, MASK_SYM } from 'src/utils/functions/phone'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { RouterPaths } from 'src/utils/config/router'
export type IForm = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  repeatPassword: string,
  phone: string,
} & IAddress

type IFormNoPass = Omit<IForm, "password" | "repeatPassword">

type ISchemaProps = {hidePassword?: boolean}

const getValidationSchema = ({ hidePassword = false }: ISchemaProps = {}) => {
  const firstName = FormFields.RequiredStr
  const lastName = FormFields.RequiredStr
  const email = FormFields.RequiredEmail
  const phone = FormFields.RequiredPhone
  const password = FormFields.Password
  const repeatPassword = FormFields.RepeatPassword
  const country = FormFields.RequiredStr
  const city = FormFields.RequiredStr
  const street = FormFields.RequiredStr
  const house = FormFields.RequiredStr
  const entrance = FormFields.RequiredStr
  const flat = FormFields.RequiredNumber
  const commentary = FormFields.Str
  const defaultFields = {firstName, lastName, email, phone}
  const passFields = {password, repeatPassword}
  const addressFields = {country, city, street, house, entrance, flat, commentary}
  if (hidePassword) {
    return yup.object<IFormNoPass>().shape({...addressFields, ...defaultFields})
  }
  return yup.object<IForm>().shape({...defaultFields, ...passFields, ...addressFields})
}


type IProps = {
  hideTitle?: boolean,
  defaultValues?: Partial<IForm>,
  hidePassword?: boolean,
  onClose?: () => void,
  oauth?: boolean
}


export const SignupFields: FC<IProps> = ({ hideTitle, defaultValues, hidePassword, onClose, oauth}) => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)
  const { mutateAsync: mutateRegister, isLoading: isLoadingReg, data, error } = useMutation({ mutationFn: authApi.register })
  const { mutateAsync: mutateRegisterOauth, isLoading: isLoadingRegOauth, data: dataOauth, error: errorOauth } = useMutation({ mutationFn: authApi.registerOauth2 })
  useEffect(() => {
    if (error || errorOauth) {
      console.log("error ???", error)
    }
  }, [error, errorOauth])
  useEffect(() => {
    if (data) {
      if (onClose) {
        onClose()
      }
      navigate(RouterPaths.Login)
    }
  }, [data, dataOauth])
  useEffect(() => {
    if (dataOauth) {
      if (onClose) {
        onClose()
      }
      tokenService.setAccessToken(dataOauth.accessToken)
      setUser(dataOauth.user)
      navigate(RouterPaths.Profile)
    }
  }, [data, dataOauth])
  const methods = useForm<IForm>({
    resolver: yupResolver(getValidationSchema({hidePassword})),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone ? getPhoneNum(defaultValues.phone) || defaultValues.phone : "",
      country: defaultValues?.country || "",
      city: defaultValues?.city || "",
      street: defaultValues?.street || "",
      commentary: defaultValues?.commentary || "",
      entrance: defaultValues?.entrance || "",
      flat: defaultValues?.flat,
      house: defaultValues?.house || "",
      password: "",
      repeatPassword: ""
    }
  })
  const { register, handleSubmit, watch, control, formState: {isSubmitted, errors}, trigger } = methods
  const onSubmit = async (form: IForm) => {
    console.log(form)
    const method = oauth ? mutateRegisterOauth : mutateRegister
    method({
      user: {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        phone: form.phone
      },
      address: {
        city: form.city,
        commentary: form.commentary,
        country: form.country,
        flat: form.flat,
        entrance: form.entrance,
        house: form.house,
        street: form.street,
      },
    })
  }
  const passMain = usePassword()
  const passRepeat = usePassword()

  const [watchPass, watchRepeat] = watch(["password", "repeatPassword"])
  useEffect(() => {
    if (isSubmitted && watchPass === watchRepeat) {
      trigger("repeatPassword")
    }
  }, [watchPass, watchRepeat, isSubmitted, trigger])
  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {!hideTitle && <Grid item xs={12}>
        <Typography>Или заполните поля</Typography>
      </Grid>}
      <Grid item sm={6} xs={12}>
        <Input
          label="Имя"
          name="firstName"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Input
          label="Фамилия"
          name="lastName"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Input
          type="email"
          InputProps={{readOnly: !!defaultValues?.email}}
          label="Почта"
          name="email"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <PhoneInput name="phone" />
      </Grid>
      {!hidePassword && <Grid item sm={6} xs={12}>
        <Box sx={{display: "flex", position: "relative"}}>
          <Input
            autoComplete="new-password" 
            label="Пароль"
            name="password"
            {...passMain.input}
          />
          <IconButton size="small" {...passMain.button}>
            {passMain.icon}
          </IconButton>
        </Box>
      </Grid>}
      {!hidePassword && <Grid item sm={6} xs={12}>
        <Box sx={{displat: "flex", position: "relative"}}>
          <Input 
            autoComplete="new-password" 
            label="Повторите пароль"
            name="repeatPassword"
            {...passRepeat.input}
          />
          <IconButton size="small" {...passRepeat.button}>
            {passRepeat.icon}
          </IconButton>
        </Box>
      </Grid>}
      <Grid item xs={12}>
        <Typography>Укажите адрес</Typography>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Input
          label="Страна"
          name="country"
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
          <AppButton
            type="submit"
            sx={{ mt: 1, mx: !onClose ? 'auto' : undefined, display: 'flex' }}
            loading={isLoadingReg || isLoadingRegOauth}
          >
            Зарегистрироваться
          </AppButton>
        </Box>
      </Grid>
      </Grid>
    </FormProvider>
  )
}
