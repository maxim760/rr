import { Box } from '@mui/material'
import {FC} from 'react'
import { NavLink } from 'react-router-dom'
import cx from "classnames"
import { FCWithChildren } from 'src/utils/types/types'
type IProps = {
  to: string,
  classesInner?: boolean
}

export const NavbarLink: FCWithChildren<IProps> = ({to, children, classesInner}) => {
  
  return (
    <Box sx={{
      "& .link": {
        borderRadius: 1,
        py: 0.5,
        px: 1,
        color: "text.main",
        bgcolor: "transparent",
      },
      [classesInner ? "& .active .link" : "& .active"]: {
        bgcolor: "action.selected"
      }
    }}>
      <NavLink to={to} className={({isActive}) => cx({"active": isActive, "link": !classesInner})}>
        {children}
      </NavLink>
    </Box>
  )
}