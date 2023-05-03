import { Grid } from '@mui/material'
import {FC} from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { GetGoodsDto } from 'src/api/services/goods/dto'
import { Input } from 'src/components/ui/form/Input'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'
import SearchIcon from '@mui/icons-material/Search';

type IProps = {
  refetch(): void,
  methods: UseFormReturn<GetGoodsDto, any>,
}

export const SearchBar: FC<IProps> = ({methods, refetch}) => {
  const {handleSubmit} = methods
  const onSubmit = (data: GetGoodsDto) => {
    refetch()
  }
  return (
    <FormProvider {...methods}>
      <Grid container noValidate spacing={1} sx={{justifyContent: "center"}} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={5}>
          <Input
            placeholder="Введите..."
            name='query'
          />
        </Grid>
        <Grid item xs={5} md={3}>
          <Input
            label="От"
            name='min'
            type="number"
          />
        </Grid>
        <Grid item xs={5} md={3}>
          <Input
            label="До"
            name='max'
            type="number"
          />
        </Grid>
        <Grid item xs={2} md={1}>
          <TooltipButton tooltip='Искать' type="submit">
            <SearchIcon />
          </TooltipButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}