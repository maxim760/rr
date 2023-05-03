import { Typography, Box } from '@mui/material'
import {FC} from 'react'
import { GithubIcon, GoogleIcon, SlackIcon, VkIcon, YandexIcon } from 'src/assets/icons/SocialIcons'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'
import {AppButton} from "src/components/ui/buttons/AppButton"
type IProps = {
  onClickSocial(path: string): () => void
}

const buttons: { icon: React.ReactNode, apiPath: string, tooltip: string }[] = [
  {icon: <YandexIcon />, apiPath: "yandex", tooltip: "Яндекс"},
]

export const SocialButtons: FC<IProps> = ({onClickSocial}) => {
  
  return (
    <Box display="flex" alignItems="center">
      <Typography>Войти с через аккаунт из соц сетей</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: "24px", "& > *": { mt: "8px" } }}>
        {buttons.map(({ icon, apiPath, tooltip }) => (
          <AppButton key={apiPath} onClick={onClickSocial(apiPath)} size="small">Через яндекс</AppButton>
        ))}
      </Box>
    </Box>
  )
}