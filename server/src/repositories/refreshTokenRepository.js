/**
 * @file refreshTokenRepository.js
 * @module refreshTokenRepository
 * @description Repositorio para la gestión de datos de la tabla 'refresh_tokens'.
 * Implementa la lógica CRUD específica de los Refresh Tokens.
 */

// Importa la instancia de la base de datos (donde están todos los modelos cargados)
import db from "../models/index.js";
import { Op } from "sequelize"; // Necesario para usar operadores como 'mayor que' (Op.gt)

// Asumimos que los modelos se llaman 'RefreshToken' y 'User' (según tu definición)
const RefreshToken = db.RefreshToken;
const User = db.User;

/**
 * @async
 * @function saveRefreshToken
 * @description Guarda un nuevo Refresh Token en la base de datos.
 * @param {number} id_usuario - ID del usuario.
 * @param {string} token - El valor del token.
 * @param {Date} expira_en - La fecha de expiración.
 * @returns {Promise<object>} El objeto del Refresh Token creado.
 */
export const saveRefreshToken = async (id_usuario, token, expira_en) => {
  // Sintaxis de Sequelize para inserción: Modelo.create(data)
  return RefreshToken.create({
    id_usuario: id_usuario,
    token: token,
    expira_en: expira_en,
    revocado: false,
  });
};

/**
 * @async
 * @function findValidRefreshToken
 * @description Busca un Refresh Token que cumpla con 3 condiciones:
 * 1. Coincida el token.
 * 2. No esté revocado (revocado = 0).
 * 3. No haya expirado (expira_en > fecha actual).
 * @param {string} token - El valor del Refresh Token a buscar.
 * @returns {Promise<object | null>} Los datos del usuario asociado (id, correo, rol) o null si no es válido.
 */
export const findValidRefreshToken = async (token) => {
  // Sintaxis de Sequelize: Uso de findOne con condiciones e 'include' para JOIN
  const tokenData = await RefreshToken.findOne({
    where: {
      token: token,
      revocado: false,
      // Usamos Op.gt (Greater Than) para verificar que la expiración sea FUTURA
      expira_en: {
        [Op.gt]: new Date(),
      },
    },
    // Incluimos el modelo User (asociado a RefreshToken) para obtener los datos del usuario
    include: [
      {
        model: User,
        // Seleccionamos solo los datos del usuario que necesitamos para el Access Token
        attributes: ["id_usuario", "correo", "rol"],
      },
    ],
  });

  // Si no se encuentra el token o el usuario asociado no se puede cargar (tokenData.user es null)
  if (!tokenData || !tokenData.user) {
    return null;
  }

  // Devolvemos los datos del usuario extraídos de la relación
  return {
    id_usuario: tokenData.user.id_usuario,
    correo: tokenData.user.correo,
    rol: tokenData.user.rol,
  };
};

/**
 * @async
 * @function revokeRefreshToken
 * @description Revoca un Refresh Token marcándolo como 'revocado = true'.
 * @param {string} token - El valor del Refresh Token a revocar.
 * @returns {Promise<number>} Número de filas afectadas.
 */
export const revokeRefreshToken = async (token) => {
  // Sintaxis de Sequelize para actualización: Modelo.update(data, {where: condiciones})
  const [rowsAffected] = await RefreshToken.update(
    { revocado: true }, // Lo que queremos cambiar
    {
      where: {
        token: token,
        revocado: false, // Solo revoca si aún no está revocado
      },
    }
  );
  // Devuelve 1 si revoca el token, 0 si no lo encuentra o ya estaba revocado.
  return rowsAffected;
};
