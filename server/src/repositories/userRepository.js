/**
 * @file userRepository.js
 * @module userRepository
 * @description Repositorio para la gestión de datos de la tabla 'usuarios' utilizando Sequelize.
 * Centraliza la lógica de acceso a datos para los usuarios.
 */

// Importa la instancia de la base de datos (donde están todos los modelos cargados)
import db from "../models/index.js";

// Asumimos que tu modelo de usuario se llama 'User'
const User = db.User;

/**
 * @async
 * @function findByEmail
 * @description Busca un usuario por su correo electrónico para el proceso de login o registro.
 * @param {string} correo - El correo electrónico del usuario.
 * @returns {Promise<object | null>} El objeto usuario de Sequelize con datos sensibles (hash) o null si no se encuentra.
 */
export const findByEmail = async (correo) => {
  // Sintaxis de Sequelize: Modelo.findOne({ where: condiciones })
  return User.findOne({
    where: { correo: correo },
    // Selecciona todos los atributos necesarios para la validación y generación de tokens
    attributes: [
      "id_usuario",
      "nombre",
      "apellido",
      "correo",
      "contrasena_hash", // Necesario para la verificación con bcrypt
      "rol",
      "activo", // Necesario para verificar si la cuenta está habilitada
    ],
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Objeto con los datos del usuario (incluye contrasena_hash).
 * @returns {Promise<object>} El objeto del usuario recién creado.
 */
export const createUser = async (userData) => {
  // Sintaxis de Sequelize: Modelo.create(data)
  return User.create(userData);
};

/**
 * @async
 * @function updateLastLogin
 * @description Actualiza el campo 'ultimo_login' del usuario a la fecha y hora actual.
 * @param {number} id_usuario - ID del usuario.
 * @returns {Promise<[number, Array<object>]>} Resultado de la actualización [número de filas afectadas, registros afectados].
 */
export const updateLastLogin = async (id_usuario) => {
  // Sintaxis de Sequelize: Modelo.update({campos}, {where: condiciones})
  return User.update(
    { ultimo_login: new Date() },
    { where: { id_usuario: id_usuario } }
  );
};
