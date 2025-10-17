/**
 * @file apiRoutes.js
 * @module Routes
 * @description Define las rutas principales para la obtención de recursos de la API.
 * Este enrutador agrupa los endpoints de tipo GET que son accedidos por diferentes roles
 * y que son la base para los dashboards de la aplicación.
 * Todas las rutas definidas aquí están protegidas por el `authMiddleware` en `server.js`.
 * @requires express
 * @requires ../controllers/apiController.js
 * @requires ../config/logger.js
 */
import { Router } from "express";
import * as apiController from "../controllers/apiController.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS ---

/**
 * @route   GET /api/activos
 * @description Obtiene una lista combinada de todos los activos (equipos y periféricos).
 * La respuesta es filtrada por el servicio (`apiService`) según el rol del usuario (Admin ve todo, Encargado ve solo los de su centro).
 * @access Private
 */
router.get("/activos", apiController.getAssets);

/**
 * @route   GET /api/centros-operacion
 * @description Obtiene la lista de centros de operación.
 * La respuesta se filtra por rol en el servicio.
 * @access Private
 */
router.get("/centros-operacion", apiController.getOperationCenters);

/**
 * @route   GET /api/centros-operacion/:id/costos
 * @description Obtiene los centros de costo asociados a un centro de operación específico por su ID.
 * @access Private
 */
router.get(
  "/centros-operacion/:id/costos",
  apiController.getCenterCostByCenterOperation
);

/**
 * @route   GET /api/usuarios
 * @description Obtiene la lista completa de todos los usuarios del sistema.
 * @access Private
 */
router.get("/usuarios", apiController.getUsers);

/**
 * @route   GET /api/logs
 * @description Obtiene el historial de logs (acciones).
 * La respuesta se filtra por rol en el servicio.
 * @access Private
 */
router.get("/logs", apiController.getLogs);

/**
 * @route   GET /api/bajas
 * @description Obtiene el historial de bajas de activos.
 * La respuesta se filtra por rol en el servicio.
 * @access Private
 */
router.get("/bajas", apiController.getDecomissions);

export default router;
