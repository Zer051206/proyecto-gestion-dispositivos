/**
 * @file requirementRepository.js
 * @module Repositories
 * @description Funciones de acceso a datos (CRUD y consultas) para el modelo Requirement (Requerimiento)
 * y sus modelos relacionados directos (RequirementAnalysis). Actúa como capa de abstracción
 * entre el servicio y el ORM (Sequelize).
 * @requires ../models/index.js
 */
import db from "../models/index.js";

/**
 * @file requirementRepository.js
 * @module Repositories
 * @description Funciones de acceso a datos para el modelo Requirement (Requerimiento) y sus modelos relacionados directos.
 * Maneja operaciones CRUD y búsquedas especializadas en la base de datos.
 * @requires ../models/index.js
 */

const {
  Requirement,
  RequirementAnalysis,
  User,
  RequirementAsset,
  RequirementStatus,
  OperationalCenter,
} = db;

// --- Funciones de Búsqueda y Consulta ---

/**
 * @async
 * @function findByCode
 * @description Busca un requerimiento por su código único.
 * @param {string} codigo_requerimiento - El código de requerimiento a buscar.
 * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object | null>} El objeto del requerimiento si se encuentra, de lo contrario, null.
 */
export const findByCode = async (codigo_requerimiento, options = {}) => {
  return Requirement.findOne({
    where: { codigo_requerimiento },
    ...options,
  });
};

/**
 * @async
 * @function findById
 * @description Busca un requerimiento por su ID primario, incluyendo modelos asociados clave.
 * @param {number} id - El ID primario del requerimiento.
 * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object | null>} El objeto del requerimiento con relaciones si se encuentra, de lo contrario, null.
 */
export const findById = async (id, options = {}) => {
  return Requirement.findOne({
    where: { id_requerimiento: id },
    include: [
      { model: RequirementStatus, as: "Status" },
      { model: User, as: "SignerCO" },
      { model: OperationalCenter, as: "CenterOfOperation" },
      // Se pueden agregar más inclusiones si son necesarias para la lectura/flujo
    ],
    ...options,
  });
};

/**
 * @async
 * @function findAll
 * @description Obtiene todos los requerimientos del sistema (usado por Admin).
 * @returns {Promise<Array<object>>} Array de objetos de requerimiento.
 */
export const findAll = async () => {
  return Requirement.findAll({
    include: [
      { model: RequirementStatus, as: "Status" },
      { model: User, as: "SignerCO" },
      { model: OperationalCenter, as: "CenterOfOperation" },
    ],
    order: [["fecha_creacion", "DESC"]],
  });
};

/**
 * @async
 * @function findByUser
 * @description Obtiene los requerimientos creados por un usuario específico (Encargado).
 * @param {number} id_usuario - El ID del usuario creador (fk_firmante_co_id).
 * @returns {Promise<Array<object>>} Array de objetos de requerimiento.
 */
export const findByUser = async (id_usuario) => {
  return Requirement.findAll({
    where: { fk_firmante_co_id: id_usuario },
    include: [
      { model: RequirementStatus, as: "Status" },
      { model: User, as: "SignerCO" },
      { model: OperationalCenter, as: "CenterOfOperation" },
    ],
    order: [["fecha_creacion", "DESC"]],
  });
};

// --- Funciones de Creación y Actualización ---

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de requerimiento en la base de datos.
 * @param {object} data - Los datos del requerimiento a crear.
 * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object>} El objeto del requerimiento creado.
 */
export const create = async (data, options = {}) => {
  return Requirement.create(data, options);
};

/**
 * @async
 * @function update
 * @description Actualiza campos específicos de un requerimiento por ID.
 * @param {number} id - El ID del requerimiento a actualizar.
 * @param {object} data - Los datos a actualizar (ej. estado, campos de firma).
 * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object>} El objeto del requerimiento actualizado.
 */
export const update = async (id, data, options = {}) => {
  const [rowsAffected, [updatedRequirement]] = await Requirement.update(data, {
    where: { id_requerimiento: id },
    returning: true,
    ...options,
  });
  // Retornamos el objeto actualizado o null si no se afectó ninguna fila
  return rowsAffected > 0 ? updatedRequirement : null;
};

/**
 * @async
 * @function createAnalysis
 * @description Crea un registro de análisis de TI asociado a un requerimiento.
 * @param {object} data - Los datos del análisis (id_requerimiento, fk_analista_ti_id, etc.).
 * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object>} El objeto del análisis creado.
 */
export const createAnalysis = async (data, options = {}) => {
  return RequirementAnalysis.create(data, options);
};

/**
 * @async
 * @function findStatusByName
 * @description Busca un estado de requerimiento por su nombre.
 * @param {string} nombre_estado - El nombre canónico del estado.
 * @param {object} [options={}] - Opciones de Sequelize (ej. para transacciones).
 * @returns {Promise<object | null>} El objeto del estado con su ID, o null si no se encuentra.
 */
export const findStatusByName = async (nombre_estado, options = {}) => {
  return RequirementStatus.findOne({
    where: { nombre_estado },
    attributes: ["id_estado_requerimiento"],
    ...options,
  });
};

/**
 * @async
 * @function findAllStatusesByName
 * @description Busca múltiples estados de requerimiento por un array de nombres.
 * @param {Array<string>} nombre_estados - Array de nombres canónicos de estados.
 * @param {object} [options={}] - Opciones de Sequelize (ej. para transacciones).
 * @returns {Promise<Array<object>>} Array de objetos de estado, incluyendo ID y nombre.
 */
export const findAllStatusesByName = async (nombre_estados, options = {}) => {
  return RequirementStatus.findAll({
    where: { nombre_estado: nombre_estados },
    attributes: ["id_estado_requerimiento", "nombre_estado"],
    ...options,
  });
};

/**
 * @async
 * @function createRequirementAsset
 * @description Crea un nuevo registro de vínculo entre un requerimiento y un activo (ej. dispositivo, periférico).
 * @param {object} data - Los datos de la vinculación (ej. id_requerimiento, id_activo, cantidad, etc.).
 * @param {object} [options={}] - Opciones de Sequelize (ej. para transacciones).
 * @returns {Promise<object>} El objeto del vínculo creado.
 */
export const createRequirementAsset = async (data, options = {}) => {
  return RequirementAsset.create(data, options);
};
