import {FC, PropsWithChildren} from 'react'
import { Navigate, Route } from 'react-router-dom'
import { RoleTypes } from 'src/api/types/models/User'
import { useAuthStore } from 'src/store/profile/authStore'

type IProps = {
  redirectTo?: string,
  role?: RoleTypes,
}

export const RequireAuth: FC<PropsWithChildren<IProps>> = ({children, role, redirectTo = "/login"}) => {
  const user = useAuthStore(state => state.user)
  console.log({user})
  const hasRole = !role || user?.roles?.some(item => item.name === role)
  console.log({user, hasRole})
  if (user && hasRole) {
    return <>{children}</>
  }
  return <Navigate replace to={redirectTo} />
}