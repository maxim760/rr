import { Box, Paper, Typography, Divider, Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { authApi } from 'src/api/services/auth/authService'
import { LoginFields } from 'src/components/screens/login/LoginFields'
import { SignupDialog } from 'src/components/screens/signup/SignupDialog'
import { SignupFields } from 'src/components/screens/signup/SignupFields'
import { SocialButtons } from 'src/components/screens/signup/SocialButtons'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { RouterPaths } from 'src/utils/config/router'
// import { useSocialButtons } from 'src/utils/hooks/auth/useSocialButtons'

interface IProps {
  
}

export const LoginPage: React.FC<IProps> = ({ }) => {
  // const { onClickSocial, openDialog, setOpenDialog, defaultForm } = useSocialButtons()
  return (
    <Layout title="Авторизация" hideHeader>
      <Box maxWidth="sm" sx={{mx: "auto"}}>
      <Paper sx={{ mt: "60px", p: "12px 16px"}} >
        <Typography variant='h5' textAlign="center">Вход</Typography>
        {/* <SocialButtons onClickSocial={onClickSocial} /> */}
        <Divider  sx={{my: "8px", }} variant="middle" />
        <LoginFields />
        </Paper>
        <Paper sx={{mt: "20px", p: "12px 16px", textAlign: "center"}}>
          <Typography>
            Ещё нет аккаунта?
            <Link sx={{ml: "8px"}} component={RouterLink} to={RouterPaths.Signup}>Зарегистрируйтесь</Link>
          </Typography>
        </Paper>
      </Box>
      {/* <SignupDialog oauth openDialog={openDialog} setOpenDialog={setOpenDialog} defaultForm={defaultForm} /> */}
    </Layout>
  )
}