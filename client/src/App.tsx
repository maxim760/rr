import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { authApi } from './api/services/auth/authService';
import { useAuthStore } from './store/profile/authStore';
import { router } from './utils/config/router';
import { tokenService } from './utils/config/tokens';

const App = () => {
  const setUser = useAuthStore(state => state.setUser)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await authApi.refresh()
        tokenService.setAccessToken(data.accessToken)
        setUser(data.user)
      } catch (e) {
        console.log("not authorized")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  if (loading) {
    return (
      <Box sx={{position: "fixed", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <CircularProgress size={40} />
      </Box>
    )
  }
  return <RouterProvider router={router} />
}

export default App;
