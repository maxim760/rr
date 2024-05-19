import { useState } from "react"

export const useDialog = <T>() => {
  const [dialog, setDialog] = useState<T | null>(null)
  const onClose = () => setDialog(null)
  const onOpen = (name: T) => () => setDialog(name)
  return {
    dialog,
    onClose,
    onOpen
  }
}