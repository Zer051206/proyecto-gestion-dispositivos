/**
 * @file catalogueService.js
 * @module Services
 * @description Capa de servicio para la obtención de datos de las tablas "catálogo".
 * Este servicio actúa como un intermediario simple entre el controlador y el repositorio de catálogos,
 * delegando la obtención de las listas de datos maestros.
 * @requires ../repositories/catalogueRepository.js
 */
import * as catalogueRepository from "../repositories/catalogueRepository.js";

/**
 * @async
 * @function getCities
 * @description Obtiene una lista de todas las ciudades.
 * @returns {Promise<Array<object>>} Un array con los objetos de ciudad, ordenados alfabéticamente.
 */
export const getCities = async () => {
  const cities = await catalogueRepository.findAllCities();
  return cities;
};

/**
 * @async
 * @function getIdTypes
 * @description Obtiene una lista de todos los tipos de identificación.
 * @returns {Promise<Array<object>>} Un array con los objetos de tipo de identificación, ordenados alfabéticamente.
 */
export const getIdTypes = async () => {
  const idTypes = await catalogueRepository.findAllIdTypes();
  return idTypes;
};

/**
 * @async
 * @function getPeripheralTypes
 * @description Obtiene una lista de todos los tipos de periféricos.
 * @returns {Promise<Array<object>>} Un array con los objetos de tipo de periférico, ordenados alfabéticamente.
 */
export const getPeripheralTypes = async () => {
  const peripheralTypes = await catalogueRepository.findAllPeripheralTypes();
  return peripheralTypes;
};

/**
 * @async
 * @function getRequirementStatus
 * @description Lógica de negocio para obtener todos los estados de requerimiento.
 * Delega la consulta a la capa de repositorio.
 * @returns {Promise<Array<object>>} Una promesa que resuelve con un array de objetos de estado.
 */
export const getRequirementStatus = async () => {
  const status = await catalogueRepository.findAllRequirementStatus();
  return status;
};
