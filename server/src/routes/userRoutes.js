/**
 * @file userRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la gestión de usuarios (CRUD).
 * Este enrutador maneja las operaciones de obtener, crear y actualizar usuarios.
 * Todas las rutas definidas aquí están protegidas y solo son accesibles por roles autorizados (Admins),
 * según la configuración en `server.js`.
 * @requires express
 * @requires ../controllers/userController.js
 */
import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { IDParamSchema } from "../schemas/globalSchema.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";

const router = Router();

// --- DEFINICIÓN DE RUTAS PARA USUARIOS ---

/**
 * @route   GET /api/usuarios/:id
 * @description Obtiene los datos de un usuario específico por su ID.
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del usuario a buscar.
 * @returns {object} 200 - Un objeto con los datos del usuario.
 * @returns {Error} 404 - Si el usuario no se encuentra.
 */
router.get("/usuarios/:id", userController.getUserById);

/**
 * @route   POST /api/usuarios
 * @description Crea uno o más usuarios nuevos en el sistema.
 * Espera un array de objetos de usuario en el cuerpo de la petición.
 * @access Private (Admin)
 * @param {Array<object>} req.body - Un array de objetos, cada uno representando un nuevo usuario a crear.
 * @returns {Array<object>} 201 - Un array con los nuevos usuarios creados.
 * @returns {Error} 400 - Si los datos de validación fallan.
 * @returns {Error} 409 - Si uno de los correos o identificaciones ya existe.
 */
router.post("/usuarios", validate(createUserSchema), userController.createUser);

/**
 * @route   PATCH /api/usuarios/:id
 * @description Actualiza los datos de un usuario existente.
 * Solo actualiza los campos proporcionados en el cuerpo de la petición.
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del usuario a actualizar.
 * @param {object} req.body - Un objeto con los campos a modificar.
 * @returns {object} 200 - El objeto del usuario con los datos actualizados.
 * @returns {Error} 404 - Si el usuario no se encuentra.
 */
router.patch(
  "/usuarios/:id",
  validate(IDParamSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser
);

/**
 * @route   PATCH /api/usuarios/:id/estado
 * @description Cambia el estado de un usuario (activo/inactivo).
 * @access Private (Admin)
 * @param {string} req.params.id - El ID del usuario cuyo estado se va a cambiar.
 * @param {object} req.body - Un objeto que contiene el nuevo estado, ej. `{ "activo": false }`.
 * @returns {object} 200 - El objeto del usuario con el estado actualizado.
 * @returns {Error} 404 - Si el usuario no se encuentra.
 * @returns {Error} 409 - Si se intenta poner un estado que el usuario ya tiene.
 */
router.patch(
  "/usuarios/:id/estado",
  validate(IDParamSchema, "params"),
  userController.stateUser
);

export default router;
