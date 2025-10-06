// src/repositories/catalogueRepository.js
import db from "../models/index.js";
const City = db.City;
const IdentificationType = db.IdentificationType;
const PeripheralType = db.PeripheralType;

/**
 * Busca todas las ciudades de la base de datos.
 * @returns {Promise<Array<City>>} Un array de ciudades, ordenado alfabéticamente.
 */
export const findAllCities = async () => {
  return City.findAll({
    order: [["nombre_ciudad", "ASC"]],
  });
};

/**
 * Busca todos los tipos de identificación.
 * @returns {Promise<Array<IdentificationType>>} Un array de tipos de identificación, ordenado alfabéticamente.
 */
export const findAllIdTypes = async () => {
  return IdentificationType.findAll({
    order: [["tipo_identificacion", "ASC"]],
  });
};

/**
 * Busca todos los tipos de periféricos.
 * @returns {Promise<Array<PeripheralType>>} Un array de tipos de periféricos, ordenado alfabéticamente.
 */
export const findAllPeripheralTypes = async () => {
  return PeripheralType.findAll({
    order: [["tipo_periferico", "ASC"]],
  });
};
