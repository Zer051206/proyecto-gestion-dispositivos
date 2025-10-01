/**
 * @file errorMiddleware.js
 * @module errorHandlerMiddleware
 * @description Middleware de manejo de errores centralizado para Express. Captura errores lanzados
 * en cualquier parte de la aplicación (rutas, controladores, middlewares) y formatea la respuesta
 * HTTP con un código de estado (statusCode) y un mensaje amigable para el cliente.
 */

import {
  AuthError,
  ForbiddenError,
  AssignmentError,
  PersonError,
  DeviceError,
  CatalogueError,
  DatabaseConnectionError,
} from "../utils/customErrors.js";
import { ZodError } from "zod";
import pkg from "jsonwebtoken";
// Importar errores específicos de Sequelize para manejo de fallos en DB
import {
  ValidationError, // Errores de validación de Sequelize
  UniqueConstraintError, // Error de unicidad (UNIQUE KEY)
  ForeignKeyConstraintError, // Error de clave foránea (RESTRICT)
  DatabaseError, // Errores generales de la DB (ej. sintaxis)
} from "sequelize";

const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 * @function errorHandler
 * @description Middleware de manejo de errores de Express (firma de 4 parámetros).
 * Decide el código de estado HTTP y el mensaje de respuesta basándose en el tipo de error lanzado.
 * @param {Error} err - Objeto de error lanzado (puede ser una instancia de error estándar o personalizado).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware (usualmente no se llama).
 * @returns {void} Envía una respuesta JSON con el formato de error estandarizado.
 */
const errorHandler = (err, req, res, _next) => {
  // Usamos _next para evitar el warning del linter
  // 🚩 Importante: Loguear el error completo en el servidor para debugging
  console.error("❌ Error capturado:", err.name, err.message);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  // 1. Manejar errores personalizados de la aplicación (ej: 400, 401, 403, 404, etc.)
  if (
    err instanceof AuthError ||
    err instanceof ForbiddenError ||
    err instanceof AssignmentError ||
    err instanceof PersonError ||
    err instanceof DeviceError ||
    err instanceof CatalogueError
  ) {
    statusCode = err.status || 400; // Asumiendo que todos estos tienen un status definido
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
    // Error al intentar insertar un valor que ya existe (ej. serial o correo)
    statusCode = 409;
    message = "El registro ya existe. El valor proporcionado ya está en uso.";
    errors = err.errors.map((e) => ({
      path: e.path,
      message: `El campo ${e.path} debe ser único.`,
    }));
  } else if (err instanceof ForeignKeyConstraintError) {
    // Error al eliminar un registro padre con hijos existentes (debido a RESTRICT)
    statusCode = 409;
    message =
      "No se puede eliminar el registro. Existen dependencias asociadas (RESTRICT).";
  } else if (err instanceof ValidationError) {
    // Error de validación de Sequelize (ej. allowNull: false)
    statusCode = 400;
    message = "Error de validación en los datos de la base de datos.";
    errors = err.errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (
    err instanceof DatabaseConnectionError ||
    err instanceof DatabaseError
  ) {
    // Errores de conexión o sintaxis SQL. Solo se muestra un mensaje genérico al cliente.
    statusCode = 500;
    message =
      "Error interno de la base de datos. Por favor, inténtelo de nuevo más tarde.";
    // En producción, es clave ocultar detalles del error.
  }

  // 5. Manejar cualquier otro error no capturado (General)
  else {
    // Si no es un error conocido, es un 500
    statusCode = 500;
    message = "Ha ocurrido un error inesperado en el servidor.";
  }

  // En desarrollo, el mensaje de error puede ser más detallado para debug.
  if (process.env.NODE_ENV !== "production" && statusCode === 500 && !errors) {
    message = err.message || message;
  }

  /**
   * @description Envía la respuesta de error estandarizada al cliente.
   */
  res.status(statusCode).json({
    success: false,
    message: message,
    // Usar el spread operator para incluir 'errors' solo si existe
    ...(errors && { errors }),
  });
};

export default errorHandler;
