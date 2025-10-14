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
    rol: userData.rol || (userData.id_admin ? "Admin" : "Encargado"),
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

export const createUser = async (id_usuario, usersData, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = usersData.map(async (userData) => {
      const { correo, password } = userData;
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
        id_creador: id_usuario,
      };

      const newUser = await userRepository.create(userForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_USUARIO",
          id_usuario: id_usuario,
          descripcion: `El Admin (ID: ${id_usuario}) creó al usuario '${newUser.correo}' (ID: ${newUser.id_usuario}).`,
          ip_usuario: ip_usuario,
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

export const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundError(`Usuario con ID ${id} no encontrado.`);
  return user;
};

export const updateUser = async (id, updateData) => {
  const userDb = await userRepository.findById(id);
  if (!userDb) {
    throw new NotFoundError("El usuario que se intenta actualizarn o existe.");
  }
  if (updateData.correo) {
    const existingUser = await userRepository.findByEmail(updateData.correo);
    if (existingUser && existingUser.id !== parseInt(id)) {
      throw new UserAlreadyExistsError(
        "El correo ya está en uso por otro usuario."
      );
    }
  }
  return userRepository.update(id, updateData);
};

export const stateUser = async (id, updateData, ip) => {
  return db.sequelize.transaction(async (t) => {
    const userDb = await userRepository.findById(id, {
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

    const updatedUser = await userRepository.update(id, updateData, {
      transaction: t,
    });

    if (userDb.activo === false) {
      await logRepository.create(
        {
          accion: "DESACTIVAR_USUARIO",
          id_usuario: id,
          descripcion: `El Admin (ID: ${id}) desactivó al usuario '${userDb.nombre}' (ID: ${id}).`,
          ip_usuario: ip,
        },
        { transaction: t }
      );
      return updatedUser;
    }

    await logRepository.create(
      {
        accion: "ACTIVAR_USUARIO",
        id_usuario: id,
        descripcion: `El Admin (ID: ${id}) activó al usuario '${userDb.nombre}' (ID: ${id}).`,
        ip_usuario: ip,
      },
      { transaction: t }
    );
    return updatedUser;
  });
};
