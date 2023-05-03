import { Box, CircularProgress } from '@mui/material'
import {FC} from 'react'
import { Center } from '../Center/Center'

type IProps = {
  
}

export const Loader: FC<IProps> = ({ }) => {
  return (
    <Center>
      <CircularProgress />
    </Center>
  )
}