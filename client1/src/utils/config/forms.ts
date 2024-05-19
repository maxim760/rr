import { IAddress } from "src/api/types/models/Address"
import * as yup from "yup"
export const PASS_MIN = 6
export const PASS_MAX = 24
export const PHONE_LENGTH = 10

export const FormMessages = {
  Required: "Поле обязательно",
  Pass: {
    Default: "Это неверный пароль",
    Required: "Поле обязательно",
    Len: `Содержит от ${PASS_MIN} до ${PASS_MAX} символов`,
    Num: `Содержит минимум одну цифру (0-9)`,
    SmallLetter: `Содержит строчные буквы (a-z)`,
    BigLetter: `Содержит прописные буквы (A-Z)`,
    Repeat: `Пароли не совпадают`
  }
}

export const FormFields = {
  Str: yup
    .string(),
  RequiredStr: yup
    .string()
    .required(FormMessages.Required),
  RequiredEmail: yup
    .string()
    .required(FormMessages.Required)
    .email("Вы ввели некорректную почту"),
  RequiredPhone: yup
    .string()
    .required(FormMessages.Required)
    .test('phone correctly', 'Вы ввели некорректный телефон', (value) => {
        return value.length === PHONE_LENGTH
    }),
  Password: yup
    .string()
    .required(FormMessages.Pass.Required)
    .test('Len', FormMessages.Pass.Len, (value: string = "") => {
      return value.length >= PASS_MIN && value.length <= PASS_MAX
    })
    .test('Num', FormMessages.Pass.Num, (value: string = "") => {
      return !!value.match(/\d/)
    })
    .test('SmallLetter', FormMessages.Pass.SmallLetter, (value: string = "") => {
      return !!value.match(/[a-z]/)
    })
    .test('BigLetter', FormMessages.Pass.BigLetter, (value: string = "") => {
      return !!value.match(/[A-Z]/)
    }),
  RepeatPassword: yup
    .string()
    .required(FormMessages.Pass.Required)
    .test("Repeat", FormMessages.Pass.Repeat, (value, context) => {
      const parent = context.parent
      return value === parent?.password
    }),
  Number: yup
    .number()
    .typeError("Введите число")
    .nullable()
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  RequiredNumber: yup
    .number()
    .typeError("Введите число")
    .required(FormMessages.Required),
  RequiredNumberPositive: yup
    .number()
    .typeError("Введите число")
    .min(0, "Не должно быть отрицательное число")
    .required(FormMessages.Required),
  RequiredNumberPercent: yup
    .number()
    .typeError("Введите число")
    .min(0, "Не должно быть отрицательное число")
    .max(99, "Не должно быть 100% и выше")
    .required(FormMessages.Required),
  RequiredComplete: yup
    .object().nullable().shape({
      label: yup.string().required(FormMessages.Required),
      id: yup.string().required(FormMessages.Required)
    }).default(null).required(FormMessages.Required),
  RequiredCompleteMultiple: yup
    .array().of(yup.object().shape({
      label: yup.string().required(FormMessages.Required),
      id: yup.string().required(FormMessages.Required)
    })).default([]).required(FormMessages.Required).test({
      message: 'Должно быть больше 0',
      test: arr => arr.length > 0,
    }),
  Boolean: yup
    .bool()
    .required(FormMessages.Required)
}

// export const getSchema = <T extends {}> (shape: Parameters<ObjectSchema<T>["shape"]>[0]) => yup.object<T>().shape(shape)
export const getSchema = <T extends {}> (shape: {[key in keyof T]: yup.ISchema<any>}) => yup.object<T>().shape(shape)