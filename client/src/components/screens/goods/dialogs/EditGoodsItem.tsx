import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CreateGoodsDto, EditGoodsDiscountDto, EditGoodsItemDto } from 'src/api/services/goods/dto'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { IGoods } from 'src/api/services/goods/response'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps, IComplete } from 'src/utils/types/types'

type EditGoodsItem = Omit<EditGoodsItemDto, "id">

const getValidationSchema = () =>
  getSchema<EditGoodsItem>({
    description: FormFields.RequiredStr,
    goodsType: FormFields.RequiredStr,
    img: FormFields.RequiredStr,
    price: FormFields.RequiredNumberPositive,
    name: FormFields.RequiredStr,
  })

type IProps = {
  invalidateQuery: string,
  id: string
  item?: IGoods
} & DialogProps

export const EditGoodsItem: FC<IProps> = ({ onClose, open, invalidateQuery, item, id }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: goodsApi.editItem,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const methods = useForm<EditGoodsItem>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {
      description: item?.description || "",
      goodsType: item?.goodsType || "",
      img: item?.img || "",
      name: item?.name || "",
      price: item?.price
    },
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditGoodsItem) => {
    mutateAsync({...data, id})
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Измените блюдо" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12} md={5}>
            <Input autoFocus label="Название" name="name" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input label="Цена" name="price" type="number" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Тип" name="goodsType" />
          </Grid>
          <Grid item xs={12}>
            <Input label="Ссылка на картинку" name="img" />
          </Grid>
          <Grid item xs={12}>
            <MultilineInput label="Описание" name="description" />
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
