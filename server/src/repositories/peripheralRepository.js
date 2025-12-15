/**
 * @file peripheralRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Peripheral'.
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los periféricos,
 * utilizando Sequelize para interactuar con la tabla 'perifericos'.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const Peripheral = db.Peripheral;
const PeripheralType = db.PeripheralType;
const OperationCenter = db.OperationCenter;
const User = db.User;
const CenterCost = db.CenterCost;
const City = db.City;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los periféricos con sus relaciones principales.
 * @returns {Promise<Array<Peripheral>>} Un array de todos los objetos de periférico con sus datos asociados.
 */
export const findAll = async () => {
  return Peripheral.findAll({
    include: [
      { model: PeripheralType, attributes: ["tipo_periferico"] },
      { model: OperationCenter, include: [
          {
            model: City, 
            attributes: ["nombre_ciudad"], 
          },
        ], attributes: ["codigo", "direccion"] },
      { model: User, as: "Creador", attributes: ["nombre", "apellido"] },
      {
        model: CenterCost,
        attributes: ["codigo_centro_costo", "centro_costo"],
      },
    ],
  });
};

/**
 * @async
 * @function findById
 * @description Busca un periférico específico por su clave primaria (ID) con sus relaciones.
 * @param {number} id - El ID del periférico a buscar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Peripheral|null>} El objeto del periférico si se encuentra, o null si no.
 */
export const findById = async (id) => {
  return Peripheral.findByPk(id);
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de periférico en la base de datos.
 * @param {object} data - Los datos del periférico a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Peripheral>} El objeto del periférico recién creado.
 */
export const create = async (data, options = {}) => {
  return Peripheral.create(data, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de un periférico existente por su ID.
 * @param {number} id - El ID del periférico a actualizar.
 * @param {object} data - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Peripheral|null>} El objeto del periférico actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, data, options = {}) => {
  const [rowsAffected] = await Peripheral.update(data, {
    where: { id_periferico: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id);
  }
  return null;
};

/**
 * @async
 * @function findByCenterId
 * @description Busca y devuelve todos los periféricos asociados a un centro de operación específico.
 * @param {number} id_centro_operacion - El ID del centro de operación.
 * @returns {Promise<Array<Peripheral>>} Un array de los periféricos encontrados para ese centro.
 */
export const findByCenterId = async (id) => {
  return Peripheral.findAll({
    where: { id_centro_operacion: id },
    include: [
      { model: OperationCenter, attributes: ["codigo", "direccion"] },
      { model: User, as: "Creador", attributes: ["nombre", "apellido", "rol"] },
      { model: PeripheralType, attributes: ["tipo_periferico"] },
    ],
  });
};
