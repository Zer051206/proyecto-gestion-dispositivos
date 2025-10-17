/**
 * @file refreshTokenRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'RefreshToken'.
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los tokens de refresco,
 * utilizando Sequelize para interactuar con la tabla 'refresh_tokens'.
 * @requires ../models/index.js
 * @requires sequelize
 */
import db from "../models/index.js";
import { Op } from "sequelize";

const RefreshToken = db.RefreshToken;
const User = db.User;

/**
 * @async
 * @function saveRefreshToken
 * @description Guarda un nuevo Refresh Token en la base de datos para un usuario específico.
 * @param {number} id_usuario - El ID del usuario al que pertenece el token.
 * @param {string} token - El valor del token a guardar.
 * @param {Date} expira_en - La fecha y hora de expiración del token.
 * @returns {Promise<RefreshToken>} El objeto del Refresh Token recién creado.
 */
export const saveRefreshToken = async (id_usuario, token, expira_en) => {
  return RefreshToken.create({
    id_usuario: id_usuario,
    token: token,
    expira_en: expira_en,
  });
};

/**
 * @async
 * @function findValidRefreshToken
 * @description Busca un Refresh Token en la base de datos que sea válido (no revocado y no expirado)
 * e incluye los datos del usuario asociado.
 * @param {string} token - El valor del Refresh Token a buscar.
 * @returns {Promise<object|null>} Un objeto plano con los datos del usuario si el token es válido, o `null` si no lo es.
 */
export const findValidRefreshToken = async (token) => {
  const tokenData = await RefreshToken.findOne({
    where: {
      token: token,
      revocado: false, // Asegura que el token no haya sido invalidado (ej. por un logout)
      expira_en: { [Op.gt]: new Date() }, // Asegura que la fecha de expiración sea mayor a la fecha actual
    },
    include: [
      {
        model: User, // Incluimos el modelo User
        attributes: ["id_usuario", "nombre", "correo", "rol"],
      },
    ],
  });

  // Si no se encontró el token o no tiene un usuario asociado, no es válido.
  if (!tokenData || !tokenData.User) {
    return null;
  }

  // Devuelve solo los datos del usuario para ser usados en la creación del nuevo accessToken.
  return tokenData.User.dataValues;
};

/**
 * @async
 * @function revokeRefreshToken
 * @description Marca un Refresh Token como revocado en la base de datos.
 * Esta acción se utiliza durante el proceso de logout para invalidar la sesión.
 * @param {string} token - El valor del Refresh Token a revocar.
 * @returns {Promise<number>} El número de filas afectadas por la actualización (debería ser 1 o 0).
 */
export const revokeRefreshToken = async (token) => {
  const [rowsAffected] = await RefreshToken.update(
    { revocado: true }, // Establece el campo 'revocado' a true
    {
      where: {
        token: token,
        revocado: false, // Solo actualiza si no estaba ya revocado
      },
    }
  );
  return rowsAffected;
};
