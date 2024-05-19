export type IAddress = {
  country: string,
  city: string,
  street: string,
  house: string,
  entrance: string,
  flat: number,
  commentary: string,
  full_address: string,
  latitude: number,
  longitude: number,
}

export type IAddressResponse = IAddress & {id: string}