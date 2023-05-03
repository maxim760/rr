export type IAddress = {
  country: string,
  city: string,
  street: string,
  house: string,
  entrance: string,
  flat: number,
  commentary: string,
}

export type IAddressResponse = IAddress & {id: string}