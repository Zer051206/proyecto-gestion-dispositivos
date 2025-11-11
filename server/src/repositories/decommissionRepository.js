/**
 * @file decommissionRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Decommission' (Bajas).
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los registros de bajas de activos.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
import { Op } from "sequelize";

const User = db.User;
const Device = db.Device;
const Peripheral = db.Peripheral;
const Decomission = db.Decomission;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los registros de bajas con sus relaciones principales (Usuario, Equipo, Periférico).
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Array<Decommission>>} Un array de todos los objetos de baja con sus datos asociados.
 */
export const findAll = async (options = {}) => {
  return Decomission.findAll({
    include: [
      {
        model: User,
        attributes: ["nombre", "apellido"],
      },
      {
        model: Device,
        attributes: ["serial"],
      },
      {
        model: Peripheral,
        attributes: ["serial_periferico"],
      },
    ],
    ...options,
  });
};

/**
 * @async
 * @function findAllById
 * @description Busca y devuelve todos los registros de bajas realizados por un usuario específico.
 * @param {number} id_centro_operacion - El ID del centro de operacion por el cual filtrar los registros.
 * @returns {Promise<Array<Decommission>>} Un array de los registros de baja encontrados para ese centro de operacion.
 */
export const findAllByCenterId = async (id_centro_operacion) => {
  return Decomission.findAll({
    include: [
      { model: User, attributes: ["nombre", "apellido", "rol"] },
      {
        model: Peripheral,
        required: false,
      },
      {
        model: Device,
        required: false,
      },
    ],
    where: {
      [Op.or]: [
        db.Sequelize.where(
          db.Sequelize.col("Device.id_centro_operacion"),
          "=",
          id_centro_operacion
        ),
        db.Sequelize.where(
          db.Sequelize.col("Peripheral.id_centro_operacion"),
          "=",
          id_centro_operacion
        ),
      ],
    },
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de baja en la base de datos.
 * @param {object} decomissionData - Los datos del registro de baja a crear (ej. { id_equipo, id_usuario }).
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Decommission>} El objeto del registro de baja recién creado.
 */
export const create = async (decomissionData, options = {}) => {
  return Decomission.create(decomissionData, options);
};
