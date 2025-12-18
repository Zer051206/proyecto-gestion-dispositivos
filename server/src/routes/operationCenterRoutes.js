/**
 * @file operationCenterRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la gestión de Centros de Operación (CRUD).
 * Este enrutador maneja las operaciones de obtener, crear y actualizar centros.
 * Todas las rutas definidas aquí están protegidas y solo son accesibles por Administradores,
 * según la configuración en `server.js`.
 * @requires express
 * @requires ../controllers/operationCenterController.js
 */

import { Router } from "express";
import * as operationCenterController from "../controllers/operationCenterController.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS PARA CENTROS DE OPERACIÓN ---

/**
 * @route   GET /api/centros-operacion/:id
 * @description Obtiene los datos de un centro de operación específico por su ID.
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del centro de operación a buscar.
 * @returns {object} 200 - Un objeto con los datos del centro.
 * @returns {Error} 404 - Si el centro no se encuentra.
 */
router.get(
  "/centros-operacion/:id",
  operationCenterController.getOperationCenterById
);

/**
 * @route   POST /api/centros-operacion
 * @description Crea uno o más centros de operación nuevos en el sistema.
 * Espera un array de objetos en el cuerpo de la petición.
 * @access Private (Admin)
 * @param {Array<object>} req.body - Un array de objetos, cada uno representando un nuevo centro.
 * @returns {Array<object>} 201 - Un array con los nuevos centros creados.
 * @returns {Error} 400 - Si los datos de validación fallan.
 * @returns {Error} 409 - Si uno de los códigos de centro ya existe.
 */
router.post(
  "/centros-operacion",
  operationCenterController.createOperationCenter
);

/**
 * @route   PATCH /api/centros-operacion/:id
 * @description Actualiza los datos de un centro de operación existente.
 * No se debe usar para cambiar el estado (activo/inactivo).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del centro a actualizar.
 * @param {object} req.body - Un objeto con los campos a modificar.
 * @returns {object} 200 - El objeto del centro con los datos actualizados.
 * @returns {Error} 404 - Si el centro no se encuentra.
 */
router.patch(
  "/centros-operacion/:id",
  operationCenterController.updateOperationCenter
);

/**
 * @route   PATCH /api/centros-operacion/:id/estado
 * @description Cambia el estado de un centro de operación (activo/inactivo).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del centro cuyo estado se va a cambiar.
 * @param {object} req.body - Un objeto que contiene el nuevo estado, ej. `{ "activo": false }`.
 * @returns {object} 200 - El objeto del centro con el estado actualizado.
 * @returns {Error} 404 - Si el centro no se encuentra.
 * @returns {Error} 409 - Si se intenta poner un estado que el centro ya tiene.
 */
router.patch(
  "/centros-operacion/:id/estado",
  operationCenterController.stateOperationCenter
);

/**
 * @route   GET /api/centros-costo
 * @description Obtiene todos los centros de costo existentes.
 * @access Private (Admin)
 * @returns {Array<object>} 200 - Un array con todos los centros de costo.
 */
router.get("/centros-costo", operationCenterController.getAllCenterCosts);

/**
 * @route   POST /api/centros-costo
 * @description Crea uno o más centros de costo nuevos en el sistema.
 * Espera un array de objetos en el cuerpo de la petición.
 * @access Private (Admin)
 * @param {Array<object>} req.body - Un array de objetos, cada uno representando un nuevo centro.
 * @returns {Array<object>} 201 - Un array con los nuevos centros creados.
 * @returns {Error} 400 - Si los datos de validación fallan.
 * @returns {Error} 409 - Si uno de los códigos de centro ya existe.
 */
router.post("/centros-costo", operationCenterController.createCenterCost)

export default router;
