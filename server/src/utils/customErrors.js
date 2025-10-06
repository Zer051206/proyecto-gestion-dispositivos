/**
 * @file customErrors.js
 * @description Define una jerarquía de clases de error personalizadas para la aplicación.
 */

/**
 * @class AppError
 * @description Clase base para todos los errores operacionales de la aplicación.
 * @augments Error
 */
export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- ERRORES GENERALES ---
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado.") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permiso para realizar esta acción.") {
    super(message, 403);
  }
}

export class DatabaseConnectionError extends AppError {
  constructor(message = "Error de conexión con la base de datos.") {
    super(message, 500);
  }
}

// --- ERRORES DE AUTENTICACIÓN ---
export class AuthError extends AppError {
  constructor(message = "Error de autenticación.", status = 401) {
    super(message, status);
  }
}

export class ExpiredTokenError extends AuthError {
  constructor(
    message = "Sesión expirada. Por favor, vuelve a iniciar sesión."
  ) {
    super(message, 401);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = "El token proporcionado es inválido o no existe.") {
    super(message, 401);
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(
    message = "El correo electrónico o la identificación ya están registrados."
  ) {
    super(message, 409);
  }
}

export class UserNotFoundOrInvalidPasswordError extends AuthError {
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas."
  ) {
    super(message, 401); // 401 Unauthorized es más estándar para logins fallidos que 404
  }
}

export class AccountDisabledError extends AuthError {
  constructor(
    message = "La cuenta está desactivada, contacte al administrador."
  ) {
    super(message, 403); // 403 Forbidden es más apropiado para una cuenta que existe pero no tiene acceso.
  }
}

// --- ERRORES DE ENTIDADES ---

export class DeviceError extends AppError {
  constructor(
    message = "Error en la operación del dispositivo.",
    status = 400
  ) {
    super(message, status);
  }
}

export class NotFoundDeviceError extends DeviceError {
  constructor(
    message = "No se encontró ningún dispositivo con el ID proporcionado."
  ) {
    super(message, 404);
  }
}

export class PeripheralError extends AppError {
  constructor(message = "Error en la operación del periférico.", status = 400) {
    super(message, status);
  }
}

export class NotFoundPeripheralError extends PeripheralError {
  constructor(
    message = "No se encontró ningún periférico con el ID proporcionado."
  ) {
    super(message, 404);
  }
}

export class OperationCenterError extends AppError {
  constructor(
    message = "Error en la operación del centro de operación.",
    status = 400
  ) {
    super(message, status);
  }
}

export class NotFoundOperationCenterError extends OperationCenterError {
  constructor(
    message = "No se encontró ningún centro de operación con el ID proporcionado."
  ) {
    super(message, 404);
  }
}

export class OperationCenterAlreadyExistsError extends OperationCenterError {
  constructor(
    message = "Ya existe un centro de operación con el mismo código."
  ) {
    super(message, 409);
  }
}

export class CatalogueError extends AppError {
  constructor(message = "Error al obtener los catálogos.", status = 500) {
    super(message, status);
  }
}
