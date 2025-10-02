/**
 * @file catalogueRepository.js
 * @module catalogueRepository
 * @description Repositorio para la gestión de datos de las tablas de catálogo
 * (Tipos de Dispositivos, Ciudades, Sedes, Tipos de Identificación, Áreas).
 */

// Importa la instancia de la base de datos (donde están todos los modelos cargados)
import db from "../models/index.js";

// Asumimos que los modelos se llaman exactamente como los definiste en el archivo anterior
const TiposDispositivos = db.TiposDispositivos;
const Ciudades = db.Ciudades;
const Sedes = db.Sedes;
const TiposIdentificacion = db.TiposIdentificacion;
const Areas = db.Areas;

/**
 * @async
 * @function fetchTiposDispositivos
 * @description Obtiene todos los tipos de dispositivos.
 * @returns {Promise<Array<object>>} Lista de tipos de dispositivos.
 */
export const fetchTiposDispositivos = async () => {
  // Sintaxis de Sequelize: Modelo.findAll() -> SELECT * FROM tipos_dispositivos
  return TiposDispositivos.findAll({
    order: [["tipo_dispositivo", "ASC"]], // Ordenar alfabéticamente
  });
};

/**
 * @async
 * @function fetchCiudades
 * @description Obtiene todas las ciudades.
 * @returns {Promise<Array<object>>} Lista de ciudades.
 */
export const fetchCiudades = async () => {
  return Ciudades.findAll({
    order: [["nombre_ciudad", "ASC"]],
  });
};

/**
 * @async
 * @function fetchSedes
 * @description Obtiene todas las sedes.
 * @returns {Promise<Array<object>>} Lista de sedes.
 */
export const fetchSedes = async () => {
  return Sedes.findAll({
    order: [["nombre_sede", "ASC"]],
  });
};

/**
 * @async
 * @function fetchTiposIdentificacion
 * @description Obtiene todos los tipos de identificación.
 * @returns {Promise<Array<object>>} Lista de tipos de identificación.
 */
export const fetchTiposIdentificacion = async () => {
  return TiposIdentificacion.findAll({
    order: [["tipo_identificacion", "ASC"]],
  });
};

/**
 * @async
 * @function fetchAreas
 * @description Obtiene todas las áreas.
 * @returns {Promise<Array<object>>} Lista de áreas.
 */
export const fetchAreas = async () => {
  return Areas.findAll({
    order: [["nombre_area", "ASC"]],
  });
};
