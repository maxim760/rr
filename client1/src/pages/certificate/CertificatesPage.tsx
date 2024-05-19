import { Box, CircularProgress, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'
import { certificateApi } from 'src/api/services/certificate/certificateService'
import { CertUserKeys, ICertificate } from 'src/api/services/certificate/response'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { IGroup, PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { hasOnlyData } from 'src/utils/config/config'
import { CurrencyFormatter, DateTimeFormatter, DayFormatter } from 'src/utils/config/formatters'
import { RouterPaths } from 'src/utils/config/router'

interface IProps {
  
}

const toPropertiesCard = (item: ICertificate, field: CertUserKeys, label: string): IGroup => {
  return {
    id: item.id,
    items: [
      {value: CurrencyFormatter.format(item.price), label: "Стоимость" },
      {value: DateTimeFormatter.format(item.created_at), label: "Дата" },
      {value: item[field].firstName, label: label + " Имя" },
      {value: item[field].lastName, label: label + " Фамилия" },
    ]
  }
}

export const CertificatePage: React.FC<IProps> = ({ }) => {
  const { isLoading, data, error } = useQuery({ queryFn: certificateApi.get, queryKey: ["certificates"] })
  return (
    <Layout title="Сертификаты">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <Box sx={{mt: 1}}>
          <Grid container maxWidth={"sm"} spacing={3} sx={{mx: "auto"}}>
          <Grid item xs={12} sm={12}>
            <PropertiesCard
              title='Полученные'
              groups={data.received.map(item => toPropertiesCard(item, "fromUser", "От кого"))}
              divider
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <PropertiesCard
              title='Подаренные'
              groups={data.donated.map(item => toPropertiesCard(item, "toUser", "Кому"))}
              divider
            >
              <Box>
                <Link to={RouterPaths.CertificateGift} >
                  <AppButton sx={{mt: 0, mx: 0}} fullWidth={false} size="small">Добавить</AppButton>
                </Link>
              </Box>
            </PropertiesCard>
          </Grid>
        </Grid>
        </Box>
      )}
      {/* {isLoading ? <CircularProgress /> : (
        <Box maxWidth="sm" sx={{ display: "flex", mx: "auto", mt: "30px" }}>
          <PropertiesCard
            sx={{width: "100%"}}
            title="Профиль"
            groups={userCardData}
          />
        </Box>
      )} */}
    </Layout>
  )
}