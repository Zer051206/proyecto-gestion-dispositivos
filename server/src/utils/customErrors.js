export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
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

export class PersonError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PersonError";
    this.status = status;
  }
}

export class DeviceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "DeviceError";
    this.status = status;
  }
}

export class CatalogueError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "CatalogueError";
    this.status = status;
  }
}
