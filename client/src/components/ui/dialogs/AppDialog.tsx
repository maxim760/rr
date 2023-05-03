import { DialogTitle, IconButton, Typography } from '@mui/material'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import { FC } from 'react'
import CloseIcon from '@mui/icons-material/Close';


type IProps = {
  title: string,
  onClose: () => void,
} & DialogProps

export const AppDialog: FC<IProps> = ({ title, onClose, children, ...props }) => {
  
  return (
    <Dialog onClose={onClose} maxWidth="sm" PaperProps={{sx: {p: "0.75rem 1rem"}}} {...props}>
      <DialogTitle sx={{display: "flex", justifyContent: "space-between", p: 0, pb: 1}}>
        <Typography>{title}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  )
}