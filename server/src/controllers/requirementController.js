/**
 * @file requirementController.js
 * @module Controllers
 * @description Controlador para los endpoints de gestión del flujo de requerimientos.
 * Maneja las solicitudes HTTP para crear, obtener, firmar (aprobar) y rechazar requerimientos,
 * delegando la lógica de negocio a `requirementService`.
 * @requires ../services/requirementService.js
 */
import * as requirementService from "../services/requirementService.js";

/**
 * @async
 * @function createRequirement
 * @description Crea un nuevo requerimiento en el sistema.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.ip` y `req.body` (datos del requerimiento).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 201 con el requerimiento creado.
 */
export const createRequirement = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const data = req.body;
    const requirement = await requirementService.createRequirement(
      user,
      ip,
      data
    );

    return res.status(201).json({
      message: "Requerimiento creado exitosamente.",
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getRequirements
 * @description Obtiene una lista de requerimientos filtrados según el rol del usuario autenticado.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la lista de requerimientos.
 */
export const getRequirements = async (req, res, next) => {
  try {
    const user = req.user;
    const requirements = await requirementService.getRequirements(user);
    return res.status(200).json({
      message: "Requerimientos obtenidos exitosamente.",
      success: true,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getRequirementById
 * @description Obtiene un requerimiento específico por su ID.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.params.id`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con el requerimiento solicitado.
 */
export const getRequirementById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const requirement = await requirementService.getRequirementById(id);
    return res.status(200).json({
      message: "Requerimiento obtenido exitosamente.",
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function singTIAnalysis
 * @description Firma y registra el análisis técnico inicial (TI) para un requerimiento, avanzando su estado.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id`, `req.ip` y `req.body` (datos del análisis).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la actualización.
 */
export const singTIAnalysis = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ip = req.ip;
    const analysisData = req.body;
    const analysis = await requirementService.singTIAnalysis(
      user,
      id,
      ip,
      analysisData
    );
    return res.status(200).json({
      message: "Análisis agregado exitosamente.",
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function singRHPayment
 * @description Firma y aprueba el pago por parte de RR. HH., avanzando el estado del requerimiento.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id` y `req.ip`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la actualización.
 */
export const singRHPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const id = req.params.id;
    const payment = await requirementService.singRHPayment(user, id, ip);
    return res.status(200).json({
      message: "Pago aprobado existosamente.",
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createAndLinkAsset
 * @description Crea activos (equipos/periféricos) y los vincula al requerimiento y al solicitante.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id`, `req.ip` y `req.body` (detalles del activo).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 201 con el resultado de la creación y vinculación.
 */
export const createAndLinkAsset = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ip = req.ip;
    const { is_equipo, asset_details } = req.body;
    const result = await requirementService.createAndLinkAsset(
      id,
      user,
      ip,
      is_equipo,
      asset_details
    );
    return res.status(201).json({
      message: "Dispositivos creados y asignados exitosamente.",
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function singTIReady
 * @description Firma de Alistamiento por parte de TI, indicando que los activos están listos para la entrega.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id` y `req.ip`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la actualización.
 */
export const singTIReady = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ip = req.ip;
    const ready = await requirementService.singTIReady(user, id, ip);
    return res.status(200).json({
      message: "El requerimiento esta listo para aprobar entrega.",
      success: true,
      data: ready,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function singRHDelivery
 * @description Firma de Entrega final por parte de RR. HH., marcando el requerimiento como completado.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id` y `req.ip`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la actualización.
 */
export const singRHDelivery = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ip = req.ip;
    const delivery = await requirementService.singRHDelivery(user, id, ip);
    return res.status(200).json({
      message: "Se aprobó la entrega exitosamente.",
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function rejectRequirement
 * @description Rechaza un requerimiento basándose en el estado actual y el rol del usuario, estableciendo el estado a CANCELADO, RECHAZADO_TI o RECHAZADO_RH.
 * @param {object} req - Objeto de solicitud de Express, debe contener `req.user`, `req.params.id`, `req.ip` y `req.body` (con `razon_rechazo`).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta 200 con la actualización de cancelación/rechazo.
 */
export const rejectRequirement = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ip = req.ip;
    const rejectData = req.body;
    const cancel = await requirementService.rejectRequirement(
      user,
      id,
      ip,
      rejectData
    );
    return res.status(200).json({
      message: "Requerimiento cancelado exitosamente.",
      success: true,
      data: cancel,
    });
  } catch (error) {
    next(error);
  }
};
