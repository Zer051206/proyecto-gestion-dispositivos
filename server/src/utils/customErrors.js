/**
 * @file customErrors.js
 * @module Utils/Errors
 * @description Define una jerarquía de clases de error personalizadas para la aplicación.
 * Esto permite un manejo de errores más granular y específico en toda la API,
 * facilitando la depuración y el envío de respuestas HTTP estandarizadas.
 */

/**
 * @class AppError
 * @description Clase base para todos los errores operacionales controlados de la aplicación.
 * Permite asociar un mensaje de error con un código de estado HTTP.
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @constructor
   * @param {string} message - El mensaje de error legible para los desarrolladores o usuarios.
   * @param {number} status - El código de estado HTTP asociado a este error.
   */
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- ERRORES GENERALES DE LA APLICACIÓN ---

/**
 * @class NotFoundError
 * @description Error para ser lanzado cuando un recurso solicitado no se encuentra en la base de datos.
 * Corresponde a un estado HTTP 404.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado.") {
    super(message, 404);
  }
}

/**
 * @class AlreadyExistsError
 * @description Error para ser lanzado al intentar crear un recurso que ya existe (ej. un código duplicado).
 * Corresponde a un estado HTTP 409 (Conflict).
 * @extends AppError
 */
export class AlreadyExistsError extends AppError {
  constructor(message = "Ya existe un recurso igual") {
    super(message, 409);
  }
}

/**
 * @class AlreadyDesactivated
 * @description Error para ser lanzado al intentar desactivar un recurso que ya está inactivo, o activar uno que ya está activo.
 * Corresponde a un estado HTTP 409 (Conflict).
 * @extends AppError
 */
export class AlreadyDesactivated extends AppError {
  constructor(
    message = "El recurso seleccionado ya esta dado de baja/desactivado."
  ) {
    super(message, 409);
  }
}

/**
 * @class ForbiddenError
 * @description Error para ser lanzado cuando un usuario autenticado no tiene los permisos necesarios para realizar una acción.
 * Corresponde a un estado HTTP 403.
 * @extends AppError
 */
export class ForbiddenError extends AppError {
  constructor(message = "No tienes permiso para realizar esta acción.") {
    super(message, 403);
  }
}

/**
 * @class DatabaseConnectionError
 * @description Error específico para fallos en la conexión inicial con la base de datos.
 * Corresponde a un estado HTTP 500.
 * @extends AppError
 */
export class DatabaseConnectionError extends AppError {
  constructor(message = "Error de conexión con la base de datos.") {
    super(message, 500);
  }
}

// --- ERRORES ESPECÍFICOS DE AUTENTICACIÓN ---

/**
 * @class AuthError
 * @description Clase base para errores relacionados con la autenticación.
 * @extends AppError
 */
export class AuthError extends AppError {
  constructor(message = "Error de autenticación.", status = 401) {
    super(message, status);
  }
}

/**
 * @class InvalidTokenError
 * @description Error para tokens JWT inválidos, malformados o no proporcionados.
 * Corresponde a un estado HTTP 401.
 * @extends AuthError
 */
export class ExpiredTokenError extends AuthError {
  constructor(
    message = "Sesión expirada. Por favor, vuelve a iniciar sesión."
  ) {
    super(message, 401);
  }
}

/**
 * @class UserAlreadyExistsError
 * @description Error específico para intentos de registro con un correo o identificación que ya existen.
 * Corresponde a un estado HTTP 409 (Conflict).
 * @extends AuthError
 */
export class InvalidTokenError extends AuthError {
  constructor(message = "El token proporcionado es inválido o no existe.") {
    super(message, 401);
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para intentos de login fallidos, ya sea por correo incorrecto o contraseña inválida.
 * No se especifica cuál de los dos falló por seguridad. Corresponde a un estado HTTP 401.
 * @extends AuthError
 */
export class UserAlreadyExistsError extends AuthError {
  constructor(
    message = "El correo electrónico o la identificación ya están registrados."
  ) {
    super(message, 409);
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para intentos de login fallidos, ya sea por correo incorrecto o contraseña inválida.
 * No se especifica cuál de los dos falló por seguridad. Corresponde a un estado HTTP 401.
 * @extends AuthError
 */
export class UserNotFoundOrInvalidPasswordError extends AuthError {
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas."
  ) {
    super(message, 401); // 401 Unauthorized es más estándar para logins fallidos que 404
  }
}

/**
 * @class AccountDisabledError
 * @description Error para intentos de login a una cuenta que existe pero ha sido desactivada.
 * Corresponde a un estado HTTP 403 (Forbidden).
 * @extends AuthError
 */
export class AccountDisabledError extends AuthError {
  constructor(
    message = "La cuenta está desactivada, contacte al administrador."
  ) {
    super(message, 403); // 403 Forbidden es más apropiado para una cuenta que existe pero no tiene acceso.
  }
}
