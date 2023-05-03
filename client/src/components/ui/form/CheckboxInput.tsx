import { Checkbox, FormControlLabel, FormControlLabelProps } from '@mui/material'
import {FC} from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type IProps = {
  name: string
} & Omit<FormControlLabelProps, "control">

export const CheckboxInput: FC<IProps> = ({name, ...props}) => {
  const {control} = useFormContext()
  return (
    <FormControlLabel
      {...props}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field: props }) => (
            <Checkbox
              {...props}
              checked={props.value}
              onChange={(e) => props.onChange(e.target.checked)}
            />
          )}
        />
      }
    />
  )
}