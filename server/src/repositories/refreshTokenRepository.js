import db from "../models/index.js";
import { Op } from "sequelize";

const RefreshToken = db.RefreshToken;
const User = db.User; // El modelo se llama 'User'

/**
 * @async
 * @function saveRefreshToken
 * @description Guarda un nuevo Refresh Token para un usuario.
 * @param {number} id_usuario - ID del usuario.
 * @param {string} token - El valor del token.
 * @param {Date} expira_en - La fecha de expiración.
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
 * @description Busca un Refresh Token válido y devuelve los datos del Usuario asociado.
 * @param {string} token - El valor del Refresh Token a buscar.
 * @returns {Promise<object | null>} Los datos del usuario asociado o null si no es válido.
 */
export const findValidRefreshToken = async (token) => {
  const tokenData = await RefreshToken.findOne({
    where: {
      token: token,
      revocado: false,
      expira_en: { [Op.gt]: new Date() },
    },
    include: [
      {
        model: User, // Incluimos el modelo User
        attributes: ["id_usuario", "nombre", "correo", "rol"],
      },
    ],
  });

  if (!tokenData || !tokenData.User) {
    return null;
  }

  return tokenData.User.dataValues;
};

/**
 * @async
 * @function revokeRefreshToken
 * @description Revoca un Refresh Token.
 */
export const revokeRefreshToken = async (token) => {
  const [rowsAffected] = await RefreshToken.update(
    { revocado: true },
    {
      where: {
        token: token,
        revocado: false,
      },
    }
  );
  return rowsAffected;
};
