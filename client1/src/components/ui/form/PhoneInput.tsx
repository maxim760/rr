import {FC} from 'react'
import { useForm, Controller, ControllerRenderProps, useFormContext } from "react-hook-form";
import NumberFormat, { NumberFormatValues , } from 'react-number-format'
import { PHONE_LENGTH } from 'src/utils/config/forms';
import { getPhoneNum, MASK_SYM } from 'src/utils/functions/phone';
import { Input } from './Input';

type IProps = {
  name: string
}

export const PhoneInput: FC<IProps> = ({name}) => {
  const { control } = useFormContext()
  const onPhoneChangeCapture = (onChange: ControllerRenderProps["onChange"]) => (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const value = event?.target?.value
    if (!value || value?.includes(MASK_SYM)) {
      return
    }
    const phoneNum = getPhoneNum(value)
    if (phoneNum && phoneNum.length === PHONE_LENGTH) {
      onChange(phoneNum)
      event.stopPropagation()
    }
  }
  const onPhoneChange = (onChange: ControllerRenderProps["onChange"]) => (v: NumberFormatValues) => {
    onChange(v.value)
  }
  const onPastePhone = (onChange: ControllerRenderProps["onChange"]) => (event: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = event.clipboardData.getData('text')
    const phoneNum = getPhoneNum(paste)
    if (!phoneNum) {
      return
    }
    event.preventDefault()
    onChange(phoneNum)
  }
  return (
    <Controller
      render={({ field: { value, onBlur, onChange },  }) => {
        return (
          <NumberFormat
            format="+7 (###) ###-##-##"
            mask={MASK_SYM}
            label="Телефон"
            placeholder="+7 (999) 999-99-99"
            onChangeCapture={onPhoneChangeCapture(onChange)}
            onBlur={onBlur}
            onPaste={onPastePhone(onChange)}
            onValueChange={onPhoneChange(onChange)}
            allowEmptyFormatting={true}
            value={value}
            type="tel"
            name={name}
            noRegister
            customInput={Input}
          />
        )
      }}
      name={name}
      control={control}
    />
  )
}