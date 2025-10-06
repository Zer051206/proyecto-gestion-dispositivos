import * as catalogueRepository from "../repositories/catalogueRepository.js";

export const getCities = async () => {
  const cities = await catalogueRepository.findAllCities();
  return cities;
};

export const getIdTypes = async () => {
  const idTypes = await catalogueRepository.findAllIdTypes();
  return idTypes;
};

export const getPeripheralTypes = async () => {
  const peripheralTypes = await catalogueRepository.findAllPeripheralTypes();
  return peripheralTypes;
};
