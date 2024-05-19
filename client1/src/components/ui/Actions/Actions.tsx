import { Box, Theme, Typography } from '@mui/material'
import { SystemStyleObject } from '@mui/system'
import {FC} from 'react'
import { FCWithChildren } from 'src/utils/types/types'

type IProps = {
  title?: string,
  sx?: SystemStyleObject<Theme>
}

export const Actions: FCWithChildren<IProps> = ({children, title = "Действия:", sx}) => {
  
  return (
    <Box sx={{display: "flex", alignItems: "center", px: 2, py: 1, borderRadius: 2, flexWrap: "wrap", gap: 0.5, ...sx}}>
      <Typography sx={{ bgcolor: "background.paper", borderRadius: 2, py: 0.5, px: 1, mr: 2, boxShadow: 2 }}>{title}</Typography>
      {children}
    </Box>
  )
}