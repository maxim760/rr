import { Box, Grid, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { FindUsersDto } from 'src/api/services/auth/dto'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'
import { hasOnlyData } from 'src/utils/config/config'
import { FormFields, getSchema } from 'src/utils/config/forms'
import SearchIcon from '@mui/icons-material/Search';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'src/components/ui/form/Input'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { GiftCertificate } from 'src/components/screens/certificate/dialogs/GiftCertificate'
import { useNavigate } from 'react-router-dom'
import { BalanceChip } from 'src/components/ui/BalanceChip/BalanceChip'
import { Actions } from 'src/components/ui/Actions/Actions'
import { curierStatuses, ICurier } from 'src/api/services/curier/response'
import { curierApi } from 'src/api/services/curier/curierService'
import { EditCurier } from 'src/components/screens/curier/dialogs/EditCurier'
import { DeleteCurier } from 'src/components/screens/curier/dialogs/DeleteCurier'
import { CreateCurier } from 'src/components/screens/curier/dialogs/CreateCurier'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { IUser } from 'src/api/types/models/User'
const getValidationSchema = () =>
  getSchema<FindUsersDto>({
    query: FormFields.Str,
  })

interface IProps {
  
}


enum Dialogs {
  Create = "create",
  Edit = "edit",
  Delete = "delete"
}
type IDialog = {
  type: Dialogs,
  value: string,
  item?: ICurier & { user: IUser }
}

const curiersQueryKey = "curiers"

export const CurierPage: React.FC<IProps> = ({ }) => {
  const {dialog, onClose, onOpen} = useDialog<IDialog>()
  const { isLoading, data, error } = useQuery({
    queryFn: curierApi.get,
    queryKey: [curiersQueryKey],
  })
  return (
    <Layout title="Курьеры">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <Actions>
            <AppButton noMargin onClick={onOpen({type: Dialogs.Create, value: ""})}>Добавить курьера</AppButton>
          </Actions>
          <Grid container spacing={2} sx={{my: 2}}>
            {data.map((item) => (
              <Grid item xs={12} sm={6} lg={3} key={item.id}> 
                <PropertiesCard
                  small
                  groups={[
                    {
                      id: item.id,
                      items: [
                        {label: "Имя", value: item.user.firstName + ' ' + item.user.lastName},
                        {label: "Телефон", value: item.user.phone},
                        {label: "Статус", value: curierStatuses[item.status]},
                      ]
                    }
                  ]}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                    <CloseButton onClick={onOpen({value: item.id, type: Dialogs.Delete})} noMargin>Удалить</CloseButton>
                    <AppButton onClick={onOpen({value: item.id, type: Dialogs.Edit, item})} noMargin>Изменить</AppButton>
                  </Box>
                </PropertiesCard>
              </Grid>
            ))}
            {!data.length && (
              <Grid item sx={{mx: "auto", mt: 4}}>
                <Typography fontWeight={400} fontSize={"1.25rem"}>Курьеров не найдено</Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
      {dialog?.type === Dialogs.Create && <CreateCurier invalidateQuery={curiersQueryKey} onClose={onClose} open/>}
      {dialog?.type === Dialogs.Edit && <EditCurier user={dialog.item?.user} invalidateQuery={curiersQueryKey} curier={dialog.item} id={dialog.value} onClose={onClose} open/>}
      {dialog?.type === Dialogs.Delete && <DeleteCurier invalidateQuery={curiersQueryKey} id={dialog.value} onClose={onClose} open/>}
    </Layout>
  )
}