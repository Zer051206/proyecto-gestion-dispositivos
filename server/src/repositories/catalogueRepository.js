/**
 * @file catalogueRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para las diversas tablas de "catálogo".
 * Este módulo encapsula todas las consultas a la base de datos para obtener listas
 * de datos maestros que se utilizan en los formularios, como ciudades, tipos de identificación, etc.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const City = db.City;
const IdentificationType = db.IdentificationType;
const PeripheralType = db.PeripheralType;
const RequirementStatus = db.RequirementStatus;

/**
 * @async
 * @function findAllCities
 * @description Busca y devuelve todas las ciudades de la base de datos, ordenadas alfabéticamente.
 * @returns {Promise<Array<City>>} Un array de todos los objetos de ciudad.
 */
export const findAllCities = async () => {
  return City.findAll({
    order: [["nombre_ciudad", "ASC"]],
  });
};

/**
 * @async
 * @function findAllIdTypes
 * @description Busca y devuelve todos los tipos de identificación de la base de datos, ordenados alfabéticamente.
 * @returns {Promise<Array<IdentificationType>>} Un array de todos los objetos de tipo de identificación.
 */
export const findAllIdTypes = async () => {
  return IdentificationType.findAll({
    order: [["tipo_identificacion", "ASC"]],
  });
};

/**
 * @async
 * @function findAllPeripheralTypes
 * @description Busca y devuelve todos los tipos de periféricos de la base de datos, ordenados alfabéticamente.
 * @returns {Promise<Array<PeripheralType>>} Un array de todos los objetos de tipo de periférico.
 */
export const findAllPeripheralTypes = async () => {
  return PeripheralType.findAll({
    order: [["tipo_periferico", "ASC"]],
  });
};
/**
 * @async
 * @function findAllRequirementStatus
 * @description Busca y devuelve todos los estados posibles de requerimiento (catálogo) de la base de datos.
 * @returns {Promise<Array<RequirementStatus>>} Un array de todos los objetos de estado de requerimiento.
 */
export const findAllRequirementStatus = async () => {
  return RequirementStatus.findAll();
};
