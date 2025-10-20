/**
 * @file errorMiddleware.js
 * @module Middlewares
 * @description Middleware de manejo de errores centralizado para Express.
 * Su función es interceptar cualquier error que ocurra en la aplicación,
 * registrar el error para auditoría y depuración, y enviar una respuesta JSON
 * estandarizada y segura al cliente.
 * @requires ../utils/customErrors.js
 * @requires zod
 * @requires jsonwebtoken
 * @requires sequelize
 * @requires ../config/logger.js
 */
import logger from "../config/logger.js";
import { AppError } from "../utils/customErrors.js";
import { ZodError } from "zod";
import pkg from "jsonwebtoken";
import {
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";

const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 * @function errorHandler
 * @description Middleware de Express que maneja todos los errores de la aplicación.
 * Identifica el tipo de error (AppError, ZodError, JWT, Sequelize, etc.) y establece
 * el código de estado y el mensaje de respuesta apropiados.
 * @param {Error} err - El objeto de error capturado.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {Function} _next - La función `next` de Express (no utilizada aquí, por convención se nombra `_next`).
 */
const errorHandler = (err, req, res, _next) => {
  // REGISTRO DEL ERROR
  // Usamos Pino para registrar el error. Pino maneja objetos de error de forma nativa,
  // incluyendo el stack trace, lo que es mucho más potente que console.error.
  logger.error("❌ Error capturado:", err.name, err.message);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    logger.error(err.stack);
  }

  // DETERMINACIÓN DEL CÓDIGO DE ESTADO Y MENSAJE
  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  //Manejar TODOS nuestros errores personalizados con una sola comprobación
  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }
  // Manejar errores de validación de Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Error de validación en los datos de la solicitud.";
    errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }
  // Manejar errores de JWT (Autenticación)
  else if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError
  ) {
    statusCode = 401;
    message = "Token inválido o expirado. Acceso no autorizado.";
  }
  // Manejar errores específicos de Sequelize (DB)
  else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = "El registro ya existe. El valor proporcionado ya está en uso.";
    errors = err.errors.map((e) => ({
      path: e.path,
      message: `El campo '${e.path}' debe ser único.`,
    }));
  } else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 409;
    message = "No se puede realizar la operación debido a registros asociados.";
  } else if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    message = "Error de validación en los datos.";
    errors = err.errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
    // Por seguridad, no exponemos detalles del error de la base de datos al cliente.
    message = "Error interno de la base de datos.";
  }

  // Si es un error genérico 500 y estamos en desarrollo, mostramos un mensaje más detallado.
  // En producción, se mantendrá el mensaje genérico para no exponer detalles de implementación.
  if (process.env.NODE_ENV !== "production" && statusCode === 500 && !errors) {
    message = err.message || message;
  }

  // ENVÍO DE LA RESPUESTA JSON ESTANDARIZADA
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }), // Añade el array de errores solo si existe
  });
};

export default errorHandler;
