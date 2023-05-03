import { FC, useState } from 'react'
import { LogoIcon } from 'src/assets/icons/LogoIcon'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { alpha, Container, Link } from '@mui/material'
import { useAuthStore } from 'src/store/profile/authStore'
import { authApi } from 'src/api/services/auth/authService'
import { useMutation } from '@tanstack/react-query'
import { tokenService } from 'src/utils/config/tokens'
import { NavLink as RouterLink } from 'react-router-dom'
import { RoleTypes } from 'src/api/types/models/User'
import { AdminLinks, RouterPaths, UserLinks } from 'src/utils/config/router'
import { NavbarLink } from '../../NavbarLink/NavbarLink'
interface IProps {}

const drawerWidth = 240

export const Header: FC<IProps> = ({}) => {
  const { mutateAsync, isLoading, data } = useMutation({
    mutationFn: authApi.logout,
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.roles?.some((item) => item.name === RoleTypes.Admin)
  const links = isAdmin ? AdminLinks : UserLinks
  const clearUser = useAuthStore((state) => state.clearUser)
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }
  const onClickLogout = async () => {
    try {
      await mutateAsync()
    } catch (e) {
      console.log('logout error', e)
    } finally {
      clearUser()
      tokenService.removeAccessToken()
    }
  }
  return (
    <>
      <AppBar elevation={2}>
        <Container>
          <Toolbar variant="dense" disableGutters>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                mr: 2,
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              component={RouterLink}
              sx={{ display: 'flex', alignItems: "center" }}
              to={RouterPaths.Profile}
            >
              <LogoIcon
                fontSize="medium"
              />
              <Typography sx={{ml: 2, fontSize: "1.5rem", color: "text.primary"}}>Miracle</Typography>
            </Link>

            <Box
              component="nav"
              sx={{
                display: { xs: 'none', sm: 'none', alignItems: "center" },
                ml: 'auto',
                
              }}
            >
              {links.map((item) => (
                <NavbarLink key={item.path} to={item.path}>{item.title}</NavbarLink>
              ))}
              {user && (
                <Button onClick={onClickLogout} sx={{ color: 'black' }}>
                  Выйти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <SwipeableDrawer
          onOpen={handleDrawerToggle}
          variant="temporary"
          open={mobileOpen}
          anchor="left"
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <LogoIcon fontSize="large" sx={{ width: '80px', height: 'auto' }} />
            <Divider />
            <List>
              {links.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <NavbarLink to={item.path} classesInner>
                    <ListItemText primary={item.title} className="link" />
                  </NavbarLink>
                </ListItem>
              ))}
              {user && (<ListItem>
                  <Button onClick={onClickLogout} sx={{ color: 'black' }}>
                    Выйти
                  </Button>
                  </ListItem>
              )}
            </List>
          </Box>
        </SwipeableDrawer>
      </Box>
    </>
  )
}
