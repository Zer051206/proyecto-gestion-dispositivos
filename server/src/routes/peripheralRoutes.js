/**
 * @file peripheralRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la gestión de periféricos (CRUD).
 * Este enrutador maneja las operaciones de obtener, crear y actualizar periféricos.
 * Todas las rutas definidas aquí están protegidas por el `authMiddleware` en `server.js`,
 * lo que significa que son de acceso privado para usuarios autenticados.
 * @requires express
 * @requires ../controllers/peripheralController.js
 */

import { Router } from "express";
import * as peripheralController from "../controllers/peripheralController.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS PARA PERIFÉRICOS ---

/**
 * @route   GET /api/perifericos
 * @description Obtiene una lista de todos los periféricos. Esta ruta es obsoleta y se mantiene
 * por compatibilidad, se recomienda usar `/api/activos` para obtener una lista unificada.
 * @access Private (Admin & Encargado)
 * @returns {Array<object>} 200 - Un array con todos los periféricos.
 */
router.get("/perifericos", peripheralController.getAllPeripherals);

/**
 * @route   GET /api/perifericos/:id
 * @description Obtiene los datos de un periférico específico por su ID.
 * @access Private (Admin & Encargado)
 * @param {string} req.params.id - El ID del periférico a buscar.
 * @returns {object} 200 - Un objeto con los datos del periférico.
 * @returns {Error} 404 - Si el periférico no se encuentra.
 */
router.get("/perifericos/:id", peripheralController.getPeripheralById);

/**
 * @route   POST /api/perifericos
 * @description Crea uno o más periféricos nuevos en el sistema.
 * Espera un array de objetos de periférico en el cuerpo de la petición.
 * @access Private (Admin & Encargado)
 * @param {Array<object>} req.body - Un array de objetos, cada uno representando un nuevo periférico.
 * @returns {Array<object>} 201 - Un array con los nuevos periféricos creados.
 * @returns {Error} 400 - Si los datos de validación fallan.
 */
router.post("/perifericos", peripheralController.createPeripheral);

/**
 * @route   PATCH /api/perifericos/:id
 * @description Actualiza los datos de un periférico existente (ej. marca, serial).
 * No se debe usar para cambiar el estado (activo/inactivo).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del periférico a actualizar.
 * @param {object} req.body - Un objeto con los campos a modificar.
 * @returns {object} 200 - El objeto del periférico con los datos actualizados.
 * @returns {Error} 404 - Si el periférico no se encuentra.
 */
router.patch("/perifericos/:id", peripheralController.updatePeripheral);

/**
 * @route   PATCH /api/perifericos/:id/estado
 * @description Cambia el estado de un periférico (activo/inactivo).
 * @access Private (Admin & Encargado)
 * @param {string} req.params.id - El ID del periférico cuyo estado se va a cambiar.
 * @param {object} req.body - Un objeto que contiene el nuevo estado, ej. `{ "estado_periferico": false }`.
 * @returns {object} 200 - El objeto del periférico con el estado actualizado.
 * @returns {Error} 404 - Si el periférico no se encuentra.
 * @returns {Error} 409 - Si se intenta poner un estado que el periférico ya tiene.
 */
router.patch("/perifericos/:id/estado", peripheralController.statePeripheral);

export default router;
