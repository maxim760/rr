import { Grid, Typography, TextField, Button, IconButton, Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FC, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import {yupResolver} from "@hookform/resolvers/yup"
import { useForm, Controller, ControllerRenderProps, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { usePassword } from 'src/utils/hooks/common/usePassword';
import { IAddress } from 'src/api/types/models/Address';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from 'src/store/profile/authStore';
import { authApi } from 'src/api/services/auth/authService'
import { useNavigate } from 'react-router-dom'
import { FormFields, FormMessages } from 'src/utils/config/forms'
import { tokenService } from 'src/utils/config/tokens'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { Input } from 'src/components/ui/form/Input'
import { RouterPaths } from 'src/utils/config/router'

type ILoginForm = {
  email: string,
  password: string,
}


const getValidationSchema = () => {
  const email = FormFields.RequiredEmail
  
  const password = FormFields.RequiredStr
  const test = FormFields.RequiredComplete
  const test2 = FormFields.RequiredCompleteMultiple
  return yup.object().shape({password, email})
}


type IProps = {
}


export const LoginFields: FC<IProps> = ({}) => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)
  const { mutateAsync, isLoading, data, error } = useMutation({ mutationFn: authApi.login })
  useEffect(() => {
    if (error) {
      console.log("error ??? login", error)
    }
  }, [error])
  useEffect(() => {
    if (data) {
      tokenService.setAccessToken(data.accessToken)
      setUser(data.user)
      navigate(RouterPaths.Profile)
    }
  }, [data])
  const methods = useForm<ILoginForm>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {
      email: "",
      password: "",
    }
  })
  const { register, handleSubmit, watch, control, formState: {isSubmitted, errors}, trigger } = methods
  const onSubmit = async (form: ILoginForm) => {
    mutateAsync({
      email: form.email,
      password: form.password
    })
  }
  const passMain = usePassword()
  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid item xs={12}>
          <Typography>Или заполните поля</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            type="email"
            label="Почта"
            name="email"
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{displat: "flex", position: "relative"}}>
            <Input
              autoComplete="current-password" 
              label="Пароль"
              name="password"
              {...passMain.input}
            />
            <IconButton size="small" {...passMain.button}>
              {passMain.icon}
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex">
            <AppButton
              type="submit"
              sx={{ mt: '10px', mx: 'auto', display: 'flex', minWidth: "150px" }}
              loading={isLoading}
            >
              Войти
            </AppButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
