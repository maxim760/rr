import { Box, Button, Dialog, Divider, Grid, IconButton, Link, Paper, TextField, Tooltip, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import {Link as RouterLink} from "react-router-dom"
import { authApi } from 'src/api/services/auth/authService'
import { SignupDialog } from 'src/components/screens/signup/SignupDialog'
import { SignupFields } from 'src/components/screens/signup/SignupFields'
import { SocialButtons } from 'src/components/screens/signup/SocialButtons'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { useAuthStore } from 'src/store/profile/authStore'
import { RouterPaths } from 'src/utils/config/router'
// import { useSocialButtons } from 'src/utils/hooks/auth/useSocialButtons'

interface IProps {
  
}

export const SignupPage: React.FC<IProps> = ({ }) => {
  // const {onClickSocial, openDialog, setOpenDialog, defaultForm} = useSocialButtons()
  return (
    <Layout hideHeader title="Регистрация">
      <Box maxWidth="md" sx={{mx: "auto"}}>
      <Paper sx={{ mt: "60px", p: "12px 16px"}} >
        <Typography variant='h5' textAlign="center">Регистрация</Typography>
        {/* <SocialButtons onClickSocial={onClickSocial} /> */}
        <Divider  sx={{my: "8px", }} variant="middle" />
        <SignupFields />
        </Paper>
        <Paper sx={{mt: "20px", p: "12px 16px", textAlign: "center"}}>
          <Typography>
            Уже зарегистрированы?
            <Link sx={{ml: "8px"}} component={RouterLink} to={RouterPaths.Login}>Войдите</Link>
          </Typography>
        </Paper>
      </Box>
      {/* <SignupDialog oauth openDialog={openDialog} setOpenDialog={setOpenDialog} defaultForm={defaultForm} /> */}
    </Layout>
  )
}