import {FC} from 'react'
import { Input } from './Input'
import { InputProps } from './types'

export const MultilineInput: FC<InputProps> = (props) => {
  
  return (
    <Input
      maxRows={5}
      multiline
      {...props}
    />
  )
}