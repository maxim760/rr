import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { curierApi } from 'src/api/services/curier/curierService'
import { EditCurierDto } from 'src/api/services/curier/dto'
import { CurierStatus, curierStatuses, ICurier } from 'src/api/services/curier/response'
import { IUser } from 'src/api/types/models/User'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { Input } from 'src/components/ui/form/Input'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps, IComplete } from 'src/utils/types/types'

type CurierComplete = IComplete<CurierStatus>
type EditCurier = Omit<EditCurierDto, "id" | "status"> & {status: CurierComplete}
const getValidationSchema = () =>
  getSchema<EditCurier>({
    firstName: FormFields.RequiredStr,
    lastName: FormFields.RequiredStr,
    phone: FormFields.RequiredPhone,
    status: FormFields.RequiredComplete
  })

type IProps = {
  invalidateQuery: string,
  id: string,
  curier?: ICurier,
  user?: IUser,
} & DialogProps

export const EditCurier: FC<IProps> = ({ onClose, open, invalidateQuery, id, curier, user }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: curierApi.edit,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })

  const methods = useForm<EditCurier>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {
      phone: user?.phone || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      status: curier?.status && curierStatuses[curier.status]
        ? { id: curier.status, label: curierStatuses[curier.status] }
        : undefined
    },
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditCurier) => {
    const { status, ...other } = data
    mutateAsync({...other, id, status: status.id})
  }
  const options: CurierComplete[] = [
    {id: CurierStatus.Free, label: curierStatuses[CurierStatus.Free]},
    {id: CurierStatus.Busy, label: curierStatuses[CurierStatus.Busy]},
  ]
  return (
    <AppDialog onClose={onClose} open={open} title="Измените курьера" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Input autoFocus label="Имя" name="name" />
          </Grid>
          <Grid item xs={12}>
            <PhoneInput name='phone'  />
          </Grid>
          <Grid item xs={12}>
            <FormComplete name='status' label='Статус' options={options}  />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              {!!onClose && (
                <CloseButton
                  onClick={onClose}
                  sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
                />
              )}
              <SaveButton
                type="submit"
                sx={{
                  mt: 1,
                  mx: !onClose ? 'auto' : undefined,
                  display: 'flex',
                }}
                loading={isLoading}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}
