/**
 * @file userService.js
 * @module Services
 * @description Capa de servicio que contiene toda la lógica de negocio para la autenticación y gestión de usuarios (CRUD).
 * Este módulo actúa como intermediario entre los controladores y los repositorios, aplicando las reglas de negocio,
 * manejando la lógica de contraseñas, tokens, y registrando eventos de auditoría.
 * @requires bcrypt
 * @requires ../models/index.js
 * @requires ../repositories/userRepository.js
 * @requires ../repositories/refreshTokenRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../utils/tokenUtils.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */
import bcrypt from "bcrypt";
import db from "../models/index.js";
import * as userRepository from "../repositories/userRepository.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as tokenUtils from "../utils/tokenUtils.js";
import {
  UserAlreadyExistsError,
  UserNotFoundOrInvalidPasswordError,
  NotFoundError,
  InvalidTokenError,
  AccountDisabledError,
  AlreadyDesactivated,
} from "../utils/customErrors.js";
import logger from "../config/logger.js";

// --- Funciones de Autenticación ---

/**
 * @async
 * @function loginUser
 * @description Valida las credenciales de un usuario, genera tokens y registra el último login.
 * @param {object} validatedData - Datos de login validados (correo y password).
 * @returns {Promise<object>} Un objeto con los tokens de acceso/refresco y los datos del usuario.
 * @throws {UserNotFoundOrInvalidPasswordError} Si el usuario no existe o la contraseña es incorrecta.
 * @throws {AccountDisabledError} Si la cuenta del usuario está inactiva.
 */
export const loginUser = async (usersData) => {
  const { correo, password } = usersData;
  const userDb = await userRepository.findByEmail(correo);

  if (!userDb) {
    logger.warn(
      { email: correo },
      "Intento de login fallido: usuario no encontrado."
    );
    throw new UserNotFoundOrInvalidPasswordError();
  }

  if (!userDb.activo) {
    logger.warn(
      { email: correo, userId: userDb.id_usuario },
      "Intento de login fallido: cuenta inactiva."
    );
    throw new AccountDisabledError();
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userDb.contrasena_hash
  );
  if (!isPasswordCorrect) {
    logger.warn(
      { email: correo, userId: userDb.id_usuario },
      "Intento de login fallido: contraseña incorrecta."
    );
    throw new UserNotFoundOrInvalidPasswordError();
  }

  if (!isPasswordCorrect) {
    logger.warn(
      { email: correo, userId: userDb.id_usuario },
      "Intento de login fallido: contraseña incorrecta."
    );
    throw new UserNotFoundOrInvalidPasswordError();
  }

  logger.info(
    { userId: userDb.id_usuario, email: correo },
    "Inicio de sesión exitoso."
  );

  const userPayload = {
    id_usuario: userDb.id_usuario,
    correo: userDb.correo,
    rol: userDb.rol,
  };
  const accessToken = tokenUtils.generateAccessToken(userPayload);
  const refreshToken = tokenUtils.generateRefreshToken();

  await refreshTokenRepository.saveRefreshToken(
    userDb.id_usuario,
    refreshToken,
    tokenUtils.getRefreshTokenExpiration()
  );
  await userRepository.updateLastLogin(userDb.id_usuario);

  return { accessToken, refreshToken, user: userPayload };
};

/**
 * @async
 * @function refreshAccessToken
 * @description Renueva un accessToken utilizando un refreshToken válido.
 * @param {string} refreshToken - El token de refresco a validar.
 * @returns {Promise<object>} Un objeto con el nuevo accessToken y los datos del usuario.
 * @throws {InvalidTokenError} Si el refreshToken no es proporcionado, es inválido o ha expirado.
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken)
    throw new InvalidTokenError("El refresh token es requerido.");

  const userData = await refreshTokenRepository.findValidRefreshToken(
    refreshToken
  );
  if (!userData)
    throw new InvalidTokenError("Refresh token inválido o expirado.");

  logger.info(
    { userId: userData.id_usuario },
    "Token de acceso renovado exitosamente."
  );

  const payload = {
    ...userData,
    rol: userData.rol,
  };
  const newAccessToken = tokenUtils.generateAccessToken(payload);

  return { accessToken: newAccessToken, user: payload };
};

/**
 * @async
 * @function logoutUser
 * @description Cierra la sesión de un usuario revocando su refreshToken.
 * @param {string} refreshToken - El token de refresco a invalidar.
 * @returns {Promise<object>} Un objeto con un mensaje de éxito.
 */
export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await refreshTokenRepository.revokeRefreshToken(refreshToken);
    logger.info("Refresh token revocado exitosamente durante el logout.");
  }
  return { message: "Logout exitoso" };
};

// --- Funciones de Gestión de Usuarios (CRUD) ---

/**
 * @async
 * @function getAllUsers
 * @description Obtiene una lista de todos los usuarios del sistema.
 * @returns {Promise<Array<object>>} Un array con los objetos de usuario.
 */
export const getAllUsers = async () => userRepository.findAll();

/**
 * @async
 * @function getUserById
 * @description Obtiene un usuario específico por su ID.
 * @param {number} id_usuario - El ID del usuario a buscar.
 * @returns {Promise<object>} El objeto del usuario encontrado.
 * @throws {NotFoundError} Si el usuario no se encuentra.
 */
export const getUserById = async (id_usuario) => {
  const user = await userRepository.findById(id_usuario);
  if (!user)
    throw new NotFoundError(`Usuario con ID ${id_usuario} no encontrado.`);
  return user;
};

/**
 * @async
 * @function createUser
 * @description Crea uno o más usuarios nuevos en una transacción.
 * @param {Array<object>} usersData - Array de objetos con los datos de los usuarios a crear.
 * @param {number} id_admin - El ID del administrador que está realizando la creación.
 * @param {string} ip_admin - La dirección IP del administrador.
 * @returns {Promise<Array<object>>} Un array con los nuevos usuarios creados (sin la contraseña).
 * @throws {UserAlreadyExistsError} Si uno de los correos ya está en uso.
 */
export const createUser = async (id_admin, usersData, ip_admin) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = usersData.map(async (userData) => {
      const { correo, password, rol } = userData;
      const userDb = await userRepository.findByEmail(correo, {
        transaction: t,
      });
      if (userDb) {
        logger.warn(
          { adminId: id_admin, attemptedEmail: correo },
          "Intento de crear usuario con correo duplicado."
        );
        throw new UserAlreadyExistsError("El correo ya está en uso.");
      }

      const contrasena_hash = await bcrypt.hash(password, 10);
      const userForDb = {
        ...userData,
        contrasena_hash: contrasena_hash,
        id_creador: id_admin,
      };

      if (rol === "Admin") {
        userForDb.id_centro_operacion = null;
      }

      const newUser = await userRepository.create(userForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_USUARIO",
          id_usuario: id_admin,
          descripcion: `El Admin (ID: ${id_admin}) creó al usuario '${newUser.correo}' (ID: ${newUser.id_usuario}).`,
          ip_usuario: ip_admin,
        },
        { transaction: t }
      );
      return newUser;
    });
    const createdUsers = await Promise.all(creationPromises);

    logger.info(
      { adminId: id_admin, count: createdUsers.length },
      `${createdUsers.length} usuario(s) creado(s) exitosamente.`
    );

    return createdUsers;
  });
};

/**
 * @async
 * @function updateUser
 * @description Actualiza los datos de un usuario existente.
 * @param {number} id_usuario - El ID del usuario a actualizar.
 * @param {object} updateData - Los datos a modificar.
 * @returns {Promise<object>} El objeto del usuario actualizado.
 * @throws {NotFoundError} Si el usuario no se encuentra.
 * @throws {UserAlreadyExistsError} Si se intenta cambiar a un correo que ya está en uso.
 */
export const updateUser = async (id_usuario, updateData) => {
  const userDb = await userRepository.findById(id_usuario);
  if (!userDb) {
    throw new NotFoundError("El usuario que se intenta actualizarn o existe.");
  }
  if (updateData.correo) {
    const existingUser = await userRepository.findByEmail(updateData.correo);
    if (existingUser && existingUser.id !== parseInt(id_usuario)) {
      throw new UserAlreadyExistsError(
        "El correo ya está en uso por otro usuario."
      );
    }
  }
  return userRepository.update(id_usuario, updateData);
};

/**
 * @async
 * @function stateUser
 * @description Cambia el estado (activo/inactivo) de un usuario.
 * @param {number} id_usuario - El ID del usuario a modificar.
 * @param {object} updateData - El objeto con el nuevo estado (ej. { activo: false }).
 * @param {number} id_admin - El ID del admin que realiza la acción.
 * @param {string} ip_admin - La IP del admin.
 * @returns {Promise<object>} El objeto del usuario actualizado.
 * @throws {NotFoundError} Si el usuario no se encuentra.
 * @throws {AppError} Si se intenta aplicar un estado que el usuario ya tiene.
 */
export const stateUser = async (id_usuario, updateData, id_admin, ip_admin) => {
  return db.sequelize.transaction(async (t) => {
    const userDb = await userRepository.findById(id_usuario, {
      transaction: t,
    });
    if (!userDb) {
      throw new NotFoundError(
        "El usuario que se intenta actualizarn o existe."
      );
    }
    if (updateData.activo !== undefined) {
      if (updateData.activo === userDb.activo) {
        const message = userDb.activo
          ? "El usuario ya está activo"
          : "El usuario ya está desactivado";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedUser = await userRepository.update(id_usuario, updateData, {
      transaction: t,
    });

    if (userDb.activo === false) {
      await logRepository.create(
        {
          accion: "DESACTIVAR_USUARIO",
          id_usuario: id_admin,
          descripcion: `El Admin (ID: ${id_admin}) desactivó al usuario '${userDb.nombre}' (ID: ${id_usuario}).`,
          ip_usuario: ip_admin,
        },
        { transaction: t }
      );
      return updatedUser;
    }

    await logRepository.create(
      {
        accion: "ACTIVAR_USUARIO",
        id_usuario: id_admin,
        descripcion: `El Admin (ID: ${id_admin}) activó al usuario '${userDb.nombre}' (ID: ${id_usuario}).`,
        ip_usuario: ip_admin,
      },
      { transaction: t }
    );
    logger.info(
      {
        adminId: id_admin,
        targetUserId: id_usuario,
        newState: updateData.activo,
      },
      "Estado de usuario cambiado exitosamente."
    );

    return updatedUser;
  });
};
