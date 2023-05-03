import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import {FC, PropsWithChildren} from 'react'

type IProps = IconButtonProps & {tooltip?: string}

export const TooltipButton: FC<PropsWithChildren<IProps>> = ({children, tooltip, ...props}) => {
  if (!tooltip || props.disabled) {
    return <IconButton {...props}>{children}</IconButton>
  }
  return (
    <Tooltip title={tooltip}>
      <IconButton {...props}>
        {children}
      </IconButton>
    </Tooltip>
  )
}