import db from "../models/index.js";
import { Op } from "sequelize"; // Necesario para consultas como IS NULL

// Asume que estos son tus modelos
const Assignment = db.Assignment;
const Person = db.Person;
const Device = db.Device;
/**
 * @async
 * @function findAssignmentById
 * @description Busca una asignación por su clave primaria (ID).
 * @param {number} assignmentId - ID de la asignación.
 * @returns {Promise<object | null>} Objeto de asignación o null.
 */
export const findAssignmentById = async (assignmentId) => {
  // findByPk es el atajo de Sequelize para buscar por Primary Key
  return Assignment.findByPk(assignmentId);
};

// ----------------------------------------------------------------------
// GESTIÓN DE TRANSACCIONES (CRUD)
// ----------------------------------------------------------------------

/**
 * @async
 * @function createAssignment
 * @description Crea un nuevo registro de asignación.
 * @param {object} assignmentData - Datos de la asignación.
 * @param {object} [options={}] - Opciones de Sequelize (para la transacción).
 * @returns {Promise<object>} El objeto de asignación creado.
 */
export const createAssignment = async (assignmentData, options = {}) => {
  // 💡 Soporta Transacciones
  return Assignment.create(assignmentData, options);
};

/**
 * @async
 * @function finishAssignment
 * @description Finaliza una asignación específica estableciendo la fecha_devolucion a la fecha actual.
 * @param {number} assignmentId - ID de la asignación a cerrar.
 * @param {object} [options={}] - Opciones de Sequelize (para la transacción).
 * @returns {Promise<Array<number>>} Array con el número de filas afectadas (ej: [1]).
 */
export const finishAssignment = async (assignmentId, options = {}) => {
  // 💡 Soporta Transacciones
  return Assignment.update(
    { fecha_devolucion: new Date() },
    {
      where: { id_asignacion: assignmentId },
      ...options, // Pasa las opciones (incluyendo la transacción)
    }
  );
};

/**
 * @async
 * @function closeActiveAssignmentByDeviceId
 * @description Cierra cualquier asignación activa actual de un dispositivo (fecha_devolucion = ahora).
 * Usado para la regla de negocio de "un dispositivo, una asignación activa".
 * @param {number} id_dispositivo - ID del dispositivo a desasociar.
 * @param {object} [options={}] - Opciones de Sequelize (para la transacción).
 * @returns {Promise<Array<number>>} Número de filas afectadas (0 o 1).
 */
export const closeActiveAssignmentByDeviceId = async (
  id_dispositivo,
  options = {}
) => {
  return Assignment.update(
    { fecha_devolucion: new Date() }, // El valor a actualizar
    {
      where: {
        id_dispositivo: id_dispositivo,
        fecha_devolucion: {
          [Op.is]: null, // Condición: WHERE fecha_devolucion IS NULL
        },
      },
      ...options, // Pasa las opciones (incluyendo la transacción)
    }
  );
};

// ----------------------------------------------------------------------
// GESTIÓN DE VISTAS Y REPORTES (HISTORIAL)
// ----------------------------------------------------------------------

/**
 * @async
 * @function fetchAssignmentHistorial
 * @description Obtiene el historial COMPLETO de asignaciones (activas y cerradas)
 * con detalles de Persona y Dispositivo para la vista de Auditoría.
 * @returns {Promise<Array<object>>} Lista de todas las asignaciones.
 */
export const fetchAssignmentHistorial = async () => {
  return Assignment.findAll({
    include: [
      {
        model: Person,
        attributes: ["nombre_persona", "apellido_persona", "identificacion"],
      },
      { model: Device, attributes: ["marca_dispositivo", "serial", "estado"] },
    ],
    order: [["fecha_asignacion", "DESC"]],
  });
};

/**
 * @async
 * @function fetchActiveAssignments
 * @description Obtiene las asignaciones que no tienen fecha de devolución (ACTIVOS)
 * para alimentar la vista principal de tarjetas.
 * @returns {Promise<Array<object>>} Lista de asignaciones activas.
 */
export const fetchActiveAssignments = async () => {
  return Assignment.findAll({
    where: {
      fecha_devolucion: {
        [Op.is]: null, // Filtra: WHERE fecha_devolucion IS NULL
      },
    },
    include: [
      // Incluye los modelos necesarios para la tarjeta de Persona/Dispositivo
      { model: Person },
      { model: Device },
    ],
    order: [["fecha_asignacion", "DESC"]],
  });
};
