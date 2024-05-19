export const MASK_SYM = "_"

export const getStartPhone = (paste: string) => {
  const starts = [
    { prefix: '+7', remove: 2 },
    { prefix: '89', remove: 1 },
    { prefix: '88', remove: 1 },
  ]
  return starts.find((start) => paste.startsWith(start.prefix))
}

export const getPhoneNum = (value = "") => {
  value = value.replace(/[^\d\+]/g, '')
  const start = getStartPhone(value) 
  if (!start) {
    return null
  }
  const phoneNum = value.substring(start.remove)
  return phoneNum
}