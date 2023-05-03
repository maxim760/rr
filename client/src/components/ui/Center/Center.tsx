import { Box } from '@mui/material'
import {FC} from 'react'
import { FCWithChildren } from 'src/utils/types/types'

export const Center: FCWithChildren = ({children}) => {
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "100%", minHeight: "100%", flex: 1 }}>
      {children}
    </Box>
  )
}