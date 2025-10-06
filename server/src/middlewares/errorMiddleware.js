/**
 * @file errorMiddleware.js
 * @description Middleware de manejo de errores centralizado para Express.
 */
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

const errorHandler = (err, req, res, _next) => {
  console.error("❌ Error capturado:", err.name, err.message);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  // 1. Manejar TODOS nuestros errores personalizados con una sola comprobación
  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }
  // 2. Manejar errores de validación de Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Error de validación en los datos de la solicitud.";
    errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }
  // 3. Manejar errores de JWT (Autenticación)
  else if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError
  ) {
    statusCode = 401;
    message = "Token inválido o expirado. Acceso no autorizado.";
  }
  // 4. Manejar errores específicos de Sequelize (DB)
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
    message = "Error interno de la base de datos.";
  }

  // En desarrollo, el mensaje de error puede ser más detallado para debug
  if (process.env.NODE_ENV !== "production" && statusCode === 500 && !errors) {
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }),
  });
};

export default errorHandler;
