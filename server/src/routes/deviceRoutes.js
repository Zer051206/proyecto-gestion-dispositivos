/**
 * @file deviceRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la gestión de equipos (CRUD).
 * Este enrutador maneja las operaciones de obtener, crear y actualizar equipos.
 * Todas las rutas definidas aquí están protegidas por el `authMiddleware` en `server.js`,
 * lo que significa que son de acceso privado para usuarios autenticados.
 * @requires express
 * @requires ../controllers/deviceController.js
 */

import { Router } from "express";
import * as deviceController from "../controllers/deviceController.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS PARA EQUIPOS ---

/**
 * @route   GET /api/dispositivos
 * @description Obtiene una lista de todos los equipos. Esta ruta es obsoleta y se mantiene
 * por compatibilidad; se recomienda usar `/api/activos` para obtener una lista unificada.
 * @access Private (Admin & Encargado)
 * @returns {Array<object>} 200 - Un array con todos los equipos.
 */
router.get("/dispositivos", deviceController.getAllDevices);

/**
 * @route   GET /api/dispositivos/:id
 * @description Obtiene los datos de un equipo específico por su ID.
 * @access Private (Admin & Encargado)
 * @param {string} req.params.id - El ID del equipo a buscar.
 * @returns {object} 200 - Un objeto con los datos del equipo.
 * @returns {Error} 404 - Si el equipo no se encuentra.
 */
router.get("/dispositivos/:id", deviceController.getDeviceById);

/**
 * @route   POST /api/dispositivos
 * @description Crea uno o más equipos nuevos en el sistema.
 * Espera un array de objetos de equipo en el cuerpo de la petición.
 * @access Private (Admin & Encargado)
 * @param {Array<object>} req.body - Un array de objetos, cada uno representando un nuevo equipo.
 * @returns {Array<object>} 201 - Un array con los nuevos equipos creados.
 * @returns {Error} 400 - Si los datos de validación fallan.
 */
router.post("/dispositivos", deviceController.createDevice);

/**
 * @route   PATCH /api/dispositivos/:id
 * @description Actualiza los datos de un equipo existente (ej. serial, empresa que alquila).
 * No se debe usar para cambiar el estado (activo/inactivo).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del equipo a actualizar.
 * @param {object} req.body - Un objeto con los campos a modificar.
 * @returns {object} 200 - El objeto del equipo con los datos actualizados.
 * @returns {Error} 404 - Si el equipo no se encuentra.
 */
router.patch("/dispositivos/:id", deviceController.updateDevice);

/**
 * @route   PATCH /api/dispositivos/:id/estado
 * @description Cambia el estado de un equipo (activo/inactivo).
 * @access Private (Admin & Encargado)
 * @param {string} req.params.id - El ID del equipo cuyo estado se va a cambiar.
 * @param {object} req.body - Un objeto que contiene el nuevo estado, ej. `{ "estado_equipo": false }`.
 * @returns {object} 200 - El objeto del equipo con el estado actualizado.
 * @returns {Error} 404 - Si el equipo no se encuentra.
 * @returns {Error} 409 - Si se intenta poner un estado que el equipo ya tiene.
 */
router.patch("/dispositivos/:id/estado", deviceController.stateDevice);

export default router;
