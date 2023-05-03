import { Grid, Typography } from '@mui/material'
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
const getValidationSchema = () =>
  getSchema<FindUsersDto>({
    query: FormFields.Str,
  })

interface IProps {
  
}

export const CertificateGiftPage: React.FC<IProps> = ({ }) => {
  const {dialog, onClose, onOpen} = useDialog<null | string>()
  const methods = useForm<FindUsersDto>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {query: ""},
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { handleSubmit, watch } = methods
  const query = watch("query")
  const { isLoading, isFetching, status,  data, error, refetch, isRefetching } = useQuery({
    queryFn: () => authApi.getUsers({ query }),
    queryKey: ["users"],
  })
  console.log({isLoading, isFetching, status, isRefetching})
  const onSubmit = () => {
    refetch()
  }
  return (
    <Layout title="Сертификаты">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
        <FormProvider {...methods}>
          <Grid container noValidate spacing={0} sx={{justifyContent: "center"}} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={11} md={5}>
              <Input
                placeholder="Введите..."
                name='query'
              />
            </Grid>
            <Grid item xs={1}>
              <TooltipButton tooltip='Искать' type="submit">
                <SearchIcon />
              </TooltipButton>
            </Grid>
          </Grid>
        </FormProvider>
          {isRefetching ? (
            <Loader/> 
          ) : (
            <>
              <BalanceChip />

              <Grid container spacing={2} sx={{mt: 2, mb: 8}}>
              {data.map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item.id}> 
                  <PropertiesCard
                    groups={[
                      {
                        id: item.id,
                        items: [
                          {label: "Имя", value: item.firstName},
                          {label: "Фамилия", value: item.lastName},
                          {label: "Почта", value: item.email},
                        ]
                      }
                    ]}
                  >
                    <AppButton onClick={onOpen(item.id)}>Выбрать</AppButton>
                  </PropertiesCard>
                </Grid>
              ))}
              {!data.length && (
                <Grid item sx={{mx: "auto", mt: 4}}>
                  <Typography fontWeight={400} fontSize={"1.25rem"}>Пользователей не найдено</Typography>
                </Grid>
              )}
              </Grid>
            </>
            )}
        </>
      )}
      {dialog && <GiftCertificate toId={dialog} onClose={onClose} open  />}
    </Layout>
  )
}