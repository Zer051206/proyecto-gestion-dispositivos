// src/repositories/AdminRepository.js
import db from "../models/index.js";
const Admin = db.Admin;

/**
 * Busca un administrador por su dirección de correo electrónico.
 * @param {string} correo - El correo del administrador a buscar.
 * @returns {Promise<Admin|null>} El objeto del administrador si se encuentra, o null.
 */
export const findByEmail = async (correo) => {
  return Admin.findOne({ where: { correo } });
};

export const findById = async (id_admin) => {
  return Admin.findByPk(id_admin);
};

/**
 * Crea un nuevo administrador en la base de datos.
 * @param {object} AdminData - Los datos del administrador a crear.
 * @returns {Promise<Admin>} El objeto del administrador recién creado.
 */
export const create = async (AdminData) => {
  return Admin.create(AdminData);
};

/**
 * Actualiza la fecha del último login de un administrador.
 * @param {number} id_admin - El ID del administrador a actualizar.
 * @returns {Promise<[number]>} Un array con el número de filas afectadas.
 */
export const updateLastLogin = async (id_admin) => {
  // El primer elemento del array devuelto por update es el número de filas afectadas.
  return Admin.update({ ultimo_login: new Date() }, { where: { id_admin } });
};
