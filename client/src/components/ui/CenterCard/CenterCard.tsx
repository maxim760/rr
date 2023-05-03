import { Box, Paper } from '@mui/material'
import {FC, PropsWithChildren} from 'react'
import { Center } from '../Center/Center'

type IProps = {
  
}

export const CenterCard: FC<PropsWithChildren<IProps>> = ({children}) => {
  
  return (
    <Center>
      <Paper sx={{p: "12px 16px", display: "flex", flexDirection: "column"}}>{children}</Paper>
    </Center>
  )
}