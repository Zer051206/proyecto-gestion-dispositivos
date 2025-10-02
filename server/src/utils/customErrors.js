export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * @class ExpiredTokenError
 * @description Error para cuando la sesión del usuario expiró (codigo 401).
 * @augments AuthError
 */
export class ExpiredTokenError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "Sesión expirada. Por favor, vuelve a iniciar sesión para continuar."
  ) {
    super(message);
    this.name = "ExpiredTokenError";
  }
}

/**
 * @class InvalidTokenError
 * @description Error para cuando el token del usuario no es válido o directamente no existe (codigo 401).
 * @augments AuthError
 */
export class InvalidTokenError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "El token de acceso proporcionado es inválido o no existe."
  ) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

/**
 * @class UserAlreadyExistsError
 * @description Error para cuando el correo electrónico ya está registrado (código 409).
 * @augments AuthError
 */
export class UserAlreadyExistsError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=409] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "El correo electrónico ya está registrado.",
    status = 409
  ) {
    super(message, status);
    this.name = "UserAlreadyExistsError";
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para credenciales incorrectas o si el usuario no exite (código 404).
 * @augments AuthError
 */
export class UserNotFoundOrInvalidPasswordError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas.",
    status = 404
  ) {
    super(message, status);
    this.name = "UserNotFoundOrInvalidPasswordError";
  }
}

/**
 * @class AccountDisabledError
 * @description Error para cuentas desactivadas (código 401).
 * @augments AuthError
 */
export class AccountDisabledError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "La cuenta está desactivada, contacte al administrador."
  ) {
    super(message);
    this.name = "AccountDisabledError";
  }
}

export class ForbiddenError extends Error {
  constructor(message, status = 403) {
    super(message);
    this.name = "ForbiddenError";
    this.status = status;
  }
}

export class DatabaseConnectionError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.status = status;
  }
}

export class AssignmentError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AssignmentError";
    this.status = status;
  }
}

export class AssignmentDontExistsError extends AssignmentError {
  constructor(
    message = "No existe ninguna asignacion con el id proporcionado",
    status = 404
  ) {
    super(message, status);
    this.name = "AssignmentDontExistsError";
  }
}

export class PersonError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PersonError";
    this.status = status;
  }
}

export class IsAlreadyPersonExistsError extends PersonError {
  constructor(
    message = "Una persona con la misma idetificacion ya existe.",
    status = 409
  ) {
    super(message, status);
    this.name = "IsAlreadyPersonExists";
  }
}

export class DeviceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "DeviceError";
    this.status = status;
  }
}

export class IsAlreadyDeviceExistsError extends DeviceError {
  constructor(
    message = "Un dispositivo con el mismo serial ya existe.",
    status = 409
  ) {
    super(message, status);
    this.name = "IsAlreadyDeviceExistsError";
  }
}

export class CatalogueError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "CatalogueError";
    this.status = status;
  }
}
