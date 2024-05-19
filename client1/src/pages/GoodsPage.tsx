import { Grid, Typography } from '@mui/material'
import React from 'react'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { hasOnlyData } from 'src/utils/config/config'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { Actions } from 'src/components/ui/Actions/Actions'
import { IGoodsResponse } from 'src/api/services/goods/response'
import { CreateGoods } from 'src/components/screens/goods/dialogs/CreateGoods'
import { useMenuSearch } from 'src/utils/hooks/menu/useMenuSearch'
import { SearchBar } from 'src/components/screens/menu/SearchBar'
import { GoodsCard } from 'src/components/screens/goods/GoodsCard'
import { EditGoodsItem } from 'src/components/screens/goods/dialogs/EditGoodsItem'
import { EditDiscount } from 'src/components/screens/goods/dialogs/EditDiscount'

interface IProps {
  
}


enum Dialogs {
  Create = "create",
  EditItem = "edit-item",
  EditDiscount = "edit-discount",
}
type IDialog = {
  type: Dialogs,
  value: string,
  item?: IGoodsResponse
}

export const GoodsPage: React.FC<IProps> = ({ }) => {
  const { dialog, onClose, onOpen } = useDialog<IDialog>()
  const {methods, queryData, invalidateQuery} = useMenuSearch()
  const {isLoading, data, error, isRefetching, refetch} = queryData
  const dialogProps = {
    item: dialog?.item,
    id: dialog?.value || "",
    onClose: onClose,
    invalidateQuery,
    open: true
  } as const
  return (
    <Layout title="Товары">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <Actions>
            <AppButton noMargin onClick={onOpen({type: Dialogs.Create, value: ""})}>Добавить товар</AppButton>
          </Actions>
          <SearchBar refetch={refetch} methods={methods} />
          <Grid container spacing={2} sx={{my: 2, alignItems: "stretch"}}>
            {isRefetching ? <Loader /> : (
              <>
                {data.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}> 
                    <GoodsCard item={item} showCount>
                      <Actions title="Изменить" sx={{p: 0}}>
                        <AppButton variant="outlined" size="small" onClick={onOpen({value: item.id, type: Dialogs.EditItem, item})} noMargin>товар</AppButton>
                      </Actions>
                    </GoodsCard>
                  </Grid>
                ))}
                {!data.length && (
                  <Grid item sx={{mx: "auto", mt: 4}}>
                    <Typography fontWeight={400} fontSize={"1.25rem"}>Блюд не найдено</Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </>
      )}
      {dialog?.type === Dialogs.Create && <CreateGoods invalidateQuery={invalidateQuery} onClose={onClose} open/>}
      {dialog?.type === Dialogs.EditItem && <EditGoodsItem  {...dialogProps} />}
      {dialog?.type === Dialogs.EditDiscount && <EditDiscount {...dialogProps} />}
    </Layout>
  )
}