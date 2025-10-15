// src/services/userService.js
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

// --- Funciones de Autenticación ---
export const loginUser = async (usersData) => {
  const { correo, password } = usersData;
  const userDb = await userRepository.findByEmail(correo);

  if (!userDb) {
    throw new UserNotFoundOrInvalidPasswordError();
  }

  if (!userDb.activo) {
    throw new AccountDisabledError();
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userDb.contrasena_hash
  );
  if (!isPasswordCorrect) throw new UserNotFoundOrInvalidPasswordError();

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

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken)
    throw new InvalidTokenError("El refresh token es requerido.");

  const userData = await refreshTokenRepository.findValidRefreshToken(
    refreshToken
  );
  if (!userData)
    throw new InvalidTokenError("Refresh token inválido o expirado.");

  const payload = {
    ...userData,
    rol: userData.rol,
  };
  const newAccessToken = tokenUtils.generateAccessToken(payload);

  return { accessToken: newAccessToken, user: payload };
};

export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await refreshTokenRepository.revokeRefreshToken(refreshToken);
  }
  return { message: "Logout exitoso" };
};

// --- Funciones de Gestión de Usuarios (CRUD) ---
export const createUser = async (id_admin, usersData, ip_admin) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = usersData.map(async (userData) => {
      const { correo, password, rol } = userData;
      const userDb = await userRepository.findByEmail(correo, {
        transaction: t,
      });
      if (userDb) {
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

    return createdUsers;
  });
};

export const getAllUsers = async () => userRepository.findAll();

export const getUserById = async (id_usuario) => {
  const user = await userRepository.findById(id_usuario);
  if (!user)
    throw new NotFoundError(`Usuario con ID ${id_usuario} no encontrado.`);
  return user;
};

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
    return updatedUser;
  });
};
