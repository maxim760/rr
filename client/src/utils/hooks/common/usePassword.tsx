import { useState } from "react"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const visibilityBtnPadding = 8
const visibilityBtnRightOffset = 8
const classes = {
  visibilityBtn: {
    position: 'absolute !important' as "absolute",
    right: visibilityBtnRightOffset + "px",
    top: "20px",
    transform: "translateY(-50%)",
    padding: visibilityBtnPadding + "px",
    display: "flex",
  },
  passwordInput: {
    "& .MuiInputBase-input": {
      paddingRight: 24 + visibilityBtnPadding * 2 + visibilityBtnRightOffset + "px"
    }
  }
}

export const usePassword = () => {
  const [visiblePassword, setVisiblePassword] = useState(false)
  const toggleVisiblePassword = () => {
    setVisiblePassword(prev => !prev)
  }
  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }
  const onMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }
  const type = visiblePassword ? "text" : "password" as const
  return {
    input: {
      type,
      sx: classes.passwordInput,
    },
    button: {
      onClick: toggleVisiblePassword,
      onMouseDown,
      onMouseUp,
      sx: classes.visibilityBtn,
    },
    icon: visiblePassword ? <VisibilityOff /> : <Visibility />
  }
}