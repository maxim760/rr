import { Dialog, Typography } from '@mui/material'
import {FC} from 'react'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { IForm, SignupFields } from './SignupFields'

type IProps = {
  openDialog: boolean,
  setOpenDialog(arg: boolean): void,
  defaultForm: Partial<IForm>,
  oauth?: boolean
}

export const SignupDialog: FC<IProps> = ({openDialog, setOpenDialog, defaultForm, oauth}) => {
  const onClose = () => {
    console.log("on close")
    setOpenDialog(false)
  }
  return (
    <AppDialog open={openDialog} maxWidth="md" title="Заполните данные, чтобы завершить регистрацию" onClose={onClose}>
      <SignupFields onClose={onClose} oauth={oauth} defaultValues={defaultForm} hidePassword hideTitle />
    </AppDialog>
  )
}