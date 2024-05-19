import { Alert, Box, CircularProgress } from '@mui/material'
import {FC} from 'react'
import { getErrorMessage } from 'src/utils/config/config'
import { Center } from '../Center/Center'

type IProps = {
  message?: string,
  error?: unknown
}

export const ErrorMessage: FC<IProps> = ({error, message = "Ошибка"}) => {
  const text = getErrorMessage(error, message)
  return (
    <Center>
      <Alert severity="error">{text}</Alert>
    </Center>
  )
}