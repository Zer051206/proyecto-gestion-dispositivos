/**
 * @file catalogueRoutes.js
 * @module Routes
 * @description Define las rutas para obtener los datos de las "tablas catálogo" de la aplicación.
 * Estas rutas son consumidas por los formularios del frontend para poblar los menús desplegables (selects),
 * como las listas de ciudades, tipos de identificación, etc.
 * @requires express
 * @requires ../controllers/catalogueController.js
 */

import { Router } from "express";
import * as catalogueController from "../controllers/catalogueController.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS PARA CATÁLOGOS ---

/**
 * @route   GET /api/catalogo/ciudades
 * @description Obtiene una lista de todas las ciudades disponibles en la base de datos.
 * @access Public - Generalmente, estas rutas son de acceso público para ser usadas en formularios de registro o creación.
 * @returns {Array<object>} 200 - Un array de objetos, donde cada objeto representa una ciudad.
 * @example `[{ id_ciudad: 1, nombre_ciudad: "Cali" }, ...]`
 */
router.get("/catalogo/ciudades", catalogueController.getCities);

/**
 * @route   GET /api/catalogo/tipos-identificacion
 * @description Obtiene una lista de todos los tipos de identificación disponibles.
 * @access Public
 * @returns {Array<object>} 200 - Un array de objetos, donde cada objeto representa un tipo de identificación.
 * @example `[{ id_tipo_identificacion: 1, tipo_identificacion: "Cédula de Ciudadanía" }, ...]`
 */
router.get("/catalogo/tipos-identificacion", catalogueController.getIdTypes);

/**
 * @route   GET /api/catalogo/tipos-perifericos
 * @description Obtiene una lista de todos los tipos de periféricos disponibles.
 * @access Public
 * @returns {Array<object>} 200 - Un array de objetos, donde cada objeto representa un tipo de periférico.
 * @example `[{ id_tipo_periferico: 1, tipo_periferico: "Monitor" }, ...]`
 */
router.get(
  "/catalogo/tipos-perifericos",
  catalogueController.getPeripheralTypes
);

/**
 * @route  GET /api/catalogo/estados-requerimientos
 * @description Obtiene una lista de todos los estados posibles en los que puede encontrarse un requerimiento.
 * Este catálogo es estático e independiente de los requerimientos ya existentes.
 * @access Public
 * @returns {Array<object>} 200 - Un array de objetos que representan los estados de requerimiento.
 * @example `[{ id_estado_requerimiento: 1, nombre_estado: "PENDIENTE_TI_ANALISIS" }, ...]`
 */
router.get(
  "/catalogo/estados-requerimientos",
  catalogueController.getRequirementStatus
);

export default router;
