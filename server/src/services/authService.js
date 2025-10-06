import bcrypt from "bcrypt";
import * as tokenUtils from "../utils/tokenUtils.js";
import * as userRepository from "../repositories/userRepository.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import {
  AccountDisabledError,
  InvalidTokenError,
  UserAlreadyExistsError,
  UserNotFoundOrInvalidPasswordError,
} from "../utils/customErrors.js";

export const registerUser = async (validateData) => {
  const { correo, password } = validateData;
  const userDb = await userRepository.findByEmail(correo);

  if (userDb) {
    throw new UserAlreadyExistsError();
  }

  const contrasena_hash = await bcrypt.hash(password, 10);
  const userForDb = {
    ...validateData,
    contrasena_hash: contrasena_hash,
  };

  const userCreated = await userRepository.createUser(userForDb);

  return {
    message: "Usuario registrado exitosamente",
    usuario: {
      id: userCreated.id_usuario,
      nombre: userCreated.nombre,
      apellido: userCreated.apellido,
      correo: userCreated.correo,
      rol: userCreated.rol,
    },
  };
};

export const loginUser = async (validateData) => {
  const { correo, password } = validateData;
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
  if (!isPasswordCorrect) {
    throw new UserNotFoundOrInvalidPasswordError();
  }

  const accessToken = tokenUtils.generateAccessToken(userDb);
  const refreshToken = tokenUtils.generateRefreshToken();
  const refreshTokenExpires = tokenUtils.getRefreshTokenExpiration();

  await refreshTokenRepository.saveRefreshToken(
    userDb.id_usuario,
    refreshToken,
    refreshTokenExpires
  );

  await userRepository.updateLastLogin(userDb.id_usuario);

  return {
    accessToken,
    refreshToken,
    user: {
      id: userDb.id_usuario,
      nombre: userDb.nombre,
      apellido: userDb.apellido,
      correo: userDb.correo,
      rol: userDb.rol,
    },
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new InvalidTokenError("El refresh token es requerido");
  }

  const tokenData = await refreshTokenRepository.findValidRefreshToken(
    refreshToken
  );

  if (!tokenData) {
    throw new InvalidTokenError("Refresh token inválido o expirado");
  }

  const newAccessToken = tokenUtils.generateAccessToken({
    id_usuario: tokenData.id_usuario,
    correo: tokenData.correo,
    rol: tokenData.rol,
  });

  return {
    accessToken: newAccessToken,
    user: {
      id: tokenData.id_usuario,
      correo: tokenData.correo,
      rol: tokenData.rol,
    },
  };
};

export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await refreshTokenRepository.revokeRefreshToken(refreshToken);
  }
  return { message: "Logout exitoso" };
};
