/**
 * @file requirementRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la gestión y el flujo de trabajo de Requerimientos.
 * Estas rutas cubren la creación, visualización y las 4 etapas de firma/aprobación (CO, TI, RH).
 * Asumimos que la autenticación (JWT) y la verificación básica de roles se aplican en un middleware externo.
 * @requires express
 * @requires ../controllers/requirementController.js
 */

import { Router } from "express";
import * as requirementController from "../controllers/requirementController.js";
import { validateAssetDetails } from "../middlewares/validateAssetMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  CreateRequirementSchema,
  SignTIAnalysisSchema,
  CreateAndLinkAssetControlSchema,
} from "../schemas/requirementSchema.js";
import { IDParamSchema } from "../schemas/globalSchema.js";

const router = Router();

/**
 * @route   POST /api/requerimientos
 * @description Crea un nuevo requerimiento de activos, iniciando el flujo de trabajo.
 * Esta acción automáticamente registra la firma del Encargado del Centro de Operación (CO).
 * @access Private (Encargado)
 * @param {object} req.body - Contiene el `asunto` y `detalle_necesidad`.
 * @returns {object} 201 - El objeto del nuevo requerimiento creado (Estado 2: Pendiente Análisis TI).
 */
router.post(
  "/requerimientos",
  validate(CreateRequirementSchema, "body"),
  requirementController.createRequirement
);

/**
 * @route   GET /api/requerimientos
 * @description Obtiene una lista paginada y filtrada de todos los requerimientos.
 * @access Private (Admin & Encargado)
 * @returns {Array<object>} 200 - Un array con los requerimientos.
 */
router.get("/requerimientos", requirementController.getRequirements);

/**
 * @route   GET /api/requerimientos/:id
 * @description Obtiene los datos de un requerimiento específico por su ID.
 * @access Private (Admin & Encargado)
 * @param {string} req.params.id - El ID del requerimiento a buscar.
 * @returns {object} 200 - Un objeto con los datos del requerimiento, incluyendo análisis y firmas.
 * @returns {Error} 404 - Si el requerimiento no se encuentra.
 */
router.get(
  "/requerimientos/:id",
  validate(IDParamSchema, "params"),
  requirementController.getRequirementById
);

// --- RUTAS DE FLUJO DE FIRMAS (PATCH) ---

/**
 * @route   PATCH /api/requerimientos/:id/ti-analisis
 * @description Registra la firma de TI y el Análisis Técnico.
 * Pasa el requerimiento a la fase de aprobación de Pago de RH (Estado 3).
 * @access Private (Admin/TI)
 * @param {string} req.params.id - El ID del requerimiento.
 * @param {object} req.body - Datos del análisis (`presupuesto_final`, `cantidad_equipos`, etc.).
 * @returns {object} 200 - Confirmación de la firma.
 */
router.patch(
  "/requerimientos/:id/ti-analisis",
  validate(IDParamSchema, "params"),
  validate(SignTIAnalysisSchema, "body"),
  requirementController.singTIAnalysis
);

/**
 * @route   PATCH /api/requerimientos/:id/rh-pago
 * @description Registra la firma de Recursos Humanos para la aprobación del Pago/Gasto.
 * Pasa el requerimiento a la fase de Alistamiento de TI (Estado 4).
 * @access Private (Admin/RH)
 * @param {string} req.params.id - El ID del requerimiento.
 * @returns {object} 200 - Confirmación de la firma.
 */
router.patch(
  "/requerimientos/:id/rh-pago",
  validate(IDParamSchema, "params"),
  requirementController.singRHPayment
);

/**
 * @route   PATCH /api/requerimientos/:id/ti-alistamiento
 * @description Registra la firma de TI confirmando que todos los activos requeridos están listos.
 * Pasa el requerimiento a la fase de Entrega Administrativa de RH (Estado 5).
 * @access Private (Admin/TI)
 * @param {string} req.params.id - El ID del requerimiento.
 * @returns {object} 200 - Confirmación de la firma.
 * @returns {Error} 400 - Si no se han vinculado todos los activos requeridos por el análisis técnico.
 */
router.patch(
  "/requerimientos/:id/ti-alistamiento",
  validate(IDParamSchema, "params"),
  requirementController.singTIReady
);

/**
 * @route   PATCH /api/requerimientos/:id/rh-entrega
 * @description Registra la firma de RH confirmando la entrega administrativa.
 * Finaliza y Cierra el requerimiento (Estado 6: Cerrado).
 * @access Private (Admin/RH)
 * @param {string} req.params.id - El ID del requerimiento.
 * @returns {object} 200 - Confirmación de la firma.
 */
router.patch(
  "/requerimientos/:id/rh-entrega",
  validate(IDParamSchema, "params"),
  requirementController.singRHDelivery
);

/**
 * @route   POST /api/requerimientos/:id/enlace-equipos
 * @description Crea un nuevo activo (equipo o periférico) y lo vincula al requerimiento,
 * consumiendo uno de los contadores definidos en el Análisis Técnico.
 * Solo puede ejecutarse cuando el requerimiento está en fase de Alistamiento (Estado 4).
 * @access Private (Admin/TI)
 * @param {string} req.params.id - El ID del requerimiento.
 * @param {object} req.body - Datos del activo a crear y vincular (serial, centro_costo, is_equipo, etc.).
 * @returns {object} 201 - El activo recién creado y vinculado.
 * @returns {Error} 400 - Si se excede el contador de equipos/periféricos del análisis.
 */
router.post(
  "/requerimientos/:id/enlace-equipos",
  validate(IDParamSchema, "params"),
  validate(CreateAndLinkAssetControlSchema, "body"),
  validateAssetDetails,
  requirementController.createAndLinkAsset
);

/**
 * @route   PATCH /api/requerimientos/:id/cancelar
 * @description Realiza el borrado lógico del requerimiento, cambiando su estado a "Cancelado" (Estado 7).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del requerimiento.
 * @returns {object} 200 - Confirmación de la cancelación.
 * @returns {Error} 400 - Si se intenta cancelar un requerimiento ya cerrado o cancelado.
 */
router.patch(
  "/requerimientos/:id/cancelar",
  validate(IDParamSchema, "params"),
  requirementController.rejectRequirement
);

export default router;
