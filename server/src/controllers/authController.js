/**
 * @file authController.js
 * @module Controllers
 * @description Controlador para los endpoints relacionados con la autenticación de usuarios.
 * Maneja las solicitudes HTTP para iniciar sesión, renovar tokens, cerrar sesión y verificar
 * el estado de la sesión, delegando la lógica de negocio a `userService`.
 * @requires ../services/userService.js
 * @requires ../schemas/userSchema.js
 * @requires ../config/logger.js
 */
import * as userService from "../services/userService.js";
import { loginSchema } from "../schemas/userSchema.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function loginUser
 * @description Maneja la solicitud de inicio de sesión de un usuario.
 * Valida los datos de entrada, llama al servicio de login y devuelve los tokens y datos del usuario.
 * @param {import('express').Request} req - El objeto de solicitud de Express. Se espera que contenga `correo` y `password` en el body.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware en caso de error.
 */
export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    logger.info({ email: validatedData.correo }, "Intento de inicio de sesión");
    const result = await userService.loginUser(validatedData);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function refreshToken
 * @description Maneja la solicitud para renovar un `accessToken` utilizando un `refreshToken`.
 * @param {import('express').Request} req - El objeto de solicitud de Express. Se espera que contenga `refreshToken` en el body.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    logger.info("Intento de renovación de token");
    const result = await userService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Token renovado exitosamente.",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function logoutUser
 * @description Maneja la solicitud de cierre de sesión. Invalida el `refreshToken` proporcionado.
 * @param {import('express').Request} req - El objeto de solicitud de Express. Se espera que contenga `refreshToken` en el body.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    logger.info("Solicitud de cierre de sesión");
    await userService.logoutUser(refreshToken);

    res.status(200).json({
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function getMe
 * @description Endpoint protegido que devuelve la información del usuario actualmente autenticado.
 * Se utiliza para validar una sesión activa en el frontend.
 * @param {import('express').Request} req - El objeto de solicitud de Express, se espera que `req.user` haya sido poblado por `authMiddleware`.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 */
export const getMe = (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
};
