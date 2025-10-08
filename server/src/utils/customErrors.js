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

export class AlreadyExistsError extends AppError {
  constructor(message = "Ya existe un recurso igual") {
    super(message, 409);
  }
}

export class AlreadyDesactivated extends AppError {
  constructor(
    message = "El recurso seleccionado ya esta dado de baja/desactivado."
  ) {
    super(message, 409);
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

export class CatalogueError extends AppError {
  constructor(message = "Error al obtener los catálogos.", status = 500) {
    super(message, status);
  }
}
