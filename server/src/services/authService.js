import bcrypt from "bcrypt";
import * as tokenUtils from "../utils/tokenUtils.js";
import * as adminRepository from "../repositories/adminRepository.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import {
  AccountDisabledError,
  AdminAlreadyExistsError,
  AdminNotFoundOrInvalidPasswordError,
  InvalidTokenError,
} from "../utils/customErrors.js";

export const registerAdmin = async (validateData) => {
  const { correo, password } = validateData;
  const adminDb = await adminRepository.findByEmail(correo);

  if (adminDb) {
    throw new AdminAlreadyExistsError();
  }

  const contrasena_hash = await bcrypt.hash(password, 10);
  const adminForDb = {
    ...validateData,
    contrasena_hash: contrasena_hash,
  };

  const adminCreated = await adminRepository.create(adminForDb);

  return {
    message: "Administrador registrado exitosamente",
    usuario: {
      id: adminCreated.id_admin,
      nombre: adminCreated.nombre,
      correo: adminCreated.correo,
    },
  };
};

export const loginAdmin = async (validateData) => {
  const { correo, password } = validateData;
  const adminDb = await adminRepository.findByEmail(correo);

  if (!adminDb) {
    throw new AdminNotFoundOrInvalidPasswordError();
  }

  if (!adminDb.activo) {
    throw new AccountDisabledError();
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    adminDb.contrasena_hash
  );

  if (!isPasswordCorrect) {
    throw new AdminNotFoundOrInvalidPasswordError();
  }

  const accessToken = tokenUtils.generateAccessToken(adminDb);
  const refreshToken = tokenUtils.generateRefreshToken();
  const refreshTokenExpires = tokenUtils.getRefreshTokenExpiration();

  await refreshTokenRepository.saveRefreshToken(
    adminDb.id_admin,
    refreshToken,
    refreshTokenExpires
  );

  await adminRepository.updateLastLogin(adminDb.id_admin);

  return {
    accessToken,
    refreshToken,
    admin: {
      id: adminDb.id_admin,
      nombre: adminDb.nombre,
      correo: adminDb.correo,
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
    id_admin: tokenData.id_admin,
    correo: tokenData.correo,
  });

  return {
    accessToken: newAccessToken,
    admin: {
      id: tokenData.id_admin,
      correo: tokenData.correo,
    },
  };
};

export const logoutAdmin = async (refreshToken) => {
  if (refreshToken) {
    await refreshTokenRepository.revokeRefreshToken(refreshToken);
  }
  return { message: "Logout exitoso" };
};
