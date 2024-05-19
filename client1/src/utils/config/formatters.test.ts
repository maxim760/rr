import { CurrencyFormatter, DateTimeFormatter, DayFormatter } from "./formatters"

const date = '2024-04-02 15:34:22'
const amount = 3200;
test('форматирование даты и времени', () => {
  expect(DateTimeFormatter.format(date)).toBe('2 апреля 2024 в 15:34')
})
test('форматирование даты', () => {
  expect(DayFormatter.format(date)).toBe('02.04.2024')
})
test('форматирование валюты', () => {
  expect(CurrencyFormatter.format(amount)).toBe('3 200,00 ₽')
})