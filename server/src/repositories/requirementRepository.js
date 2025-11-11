/**
 * @file requirementRepository.js
 * @module Repositories
 * @description Funciones de acceso a datos (CRUD y consultas) para el modelo Requirement (Requerimiento)
 * y sus modelos relacionados directos (TechnicalAnalysis). Actúa como capa de abstracción
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
  TechnicalAnalysis,
  User,
  RequirementAsset,
  RequirementStatus,
  OperationCenter,
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
      {
        model: TechnicalAnalysis,
        as: "TechnicalAnalysis",
        include: [{ model: User, as: "AnalistaTI" }],
      },
      { model: OperationCenter, as: "CenterOfOperation" },
      { model: User, as: "SignerRHPayment" },
      { model: User, as: "SignerTIReady" },
      { model: User, as: "SignerRHDelivery" },
      { model: User, as: "SignerTIAnalysis" },
      {
        model: RequirementAsset,
        as: "LinkedAssets",
        include: [
          { model: db.Device, as: "EquipoAsignado" },
          { model: db.Peripheral, as: "PerifericoAsignado" },
        ],
      },
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
      {
        model: TechnicalAnalysis,
        as: "TechnicalAnalysis",
        include: [{ model: User, as: "AnalistaTI" }],
      },
      { model: OperationCenter, as: "CenterOfOperation" },
      { model: User, as: "SignerRHPayment" },
      { model: User, as: "SignerTIReady" },
      { model: User, as: "SignerRHDelivery" },
      { model: User, as: "SignerTIAnalysis" },
      {
        model: RequirementAsset,
        as: "LinkedAssets",
        include: [
          { model: db.Device, as: "EquipoAsignado" },
          { model: db.Peripheral, as: "PerifericoAsignado" },
        ],
      },
    ],
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
      {
        model: TechnicalAnalysis,
        as: "TechnicalAnalysis",
        include: [{ model: User, as: "AnalistaTI" }],
      },
      { model: OperationCenter, as: "CenterOfOperation" },
      { model: User, as: "SignerRHPayment" },
      { model: User, as: "SignerTIReady" },
      { model: User, as: "SignerRHDelivery" },
      { model: User, as: "SignerTIAnalysis" },
      {
        model: RequirementAsset,
        as: "LinkedAssets",
        include: [
          { model: db.Device, as: "EquipoAsignado" },
          { model: db.Peripheral, as: "PerifericoAsignado" },
        ],
      },
    ],
    order: [["fecha_solicitud", "DESC"]],
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
  // Corrección: Capturamos los elementos de forma simple
  const [rowsAffected] = await Requirement.update(data, {
    where: { id_requerimiento: id },
    ...options,
  });

  return rowsAffected > 0;
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
  return TechnicalAnalysis.create(data, options);
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

/**
 * @async
 * @function findLastRequirementByCO
 * @description Busca el último requerimiento creado para un Centro de Operación específico,
 * ordenado por el código de requerimiento (asumiendo que es alfanuméricamente secuencial)
 * o por la fecha de solicitud, para determinar el consecutivo.
 * @param {number} id_center - El ID del Centro de Operación (`id_centro_operacion`).
 * @param {object} [options] - Opciones de consulta de Sequelize (ej. { transaction: t }).
 * @returns {Promise<object | null>} El objeto del último requerimiento encontrado o `null` si no existe.
 */
export const findLastRequirementByCO = async (id_center, options = {}) => {
  const lastRequirement = await Requirement.findOne({
    where: {
      id_centro_operacion: id_center,
    },
    order: [["codigo_requerimiento", "DESC"]],
    limit: 1, // Solo necesitamos el más reciente
    ...options,
  });

  // Retorna el objeto del requerimiento o null si no se encuentra
  return lastRequirement;
};
