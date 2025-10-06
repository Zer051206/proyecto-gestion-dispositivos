// src/repositories/userRepository.js
import db from "../models/index.js";
const User = db.User;

/**
 * Busca un usuario por su dirección de correo electrónico.
 * @param {string} correo - El correo del usuario a buscar.
 * @returns {Promise<User|null>} El objeto del usuario si se encuentra, o null.
 */
export const findByEmail = async (correo) => {
  return User.findOne({ where: { correo } });
};

export const findById = async (id_usuario) => {
  return User.findOne({ where: { id_usuario: id_usuario } });
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Los datos del usuario a crear.
 * @returns {Promise<User>} El objeto del usuario recién creado.
 */
export const createUser = async (userData) => {
  return User.create(userData);
};

/**
 * Actualiza la fecha del último login de un usuario.
 * @param {number} id_usuario - El ID del usuario a actualizar.
 * @returns {Promise<[number]>} Un array con el número de filas afectadas.
 */
export const updateLastLogin = async (id_usuario) => {
  // El primer elemento del array devuelto por update es el número de filas afectadas.
  return User.update({ ultimo_login: new Date() }, { where: { id_usuario } });
};
