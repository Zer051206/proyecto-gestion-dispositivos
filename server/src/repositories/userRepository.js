/**
 * @file userRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'User'.
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los usuarios,
 * utilizando Sequelize para interactuar con la tabla 'usuarios'.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const User = db.User;
const OperationCenter = db.OperationCenter;
const IdentificationType = db.IdentificationType;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los usuarios con sus relaciones principales.
 * Excluye el hash de la contraseña por seguridad en todas las consultas.
 * @returns {Promise<Array<User>>} Un array de todos los objetos de usuario con sus datos asociados.
 */
export const findAll = async () => {
  return User.findAll({
    attributes: { exclude: ["contrasena_hash"] },
    include: [
      {
        model: OperationCenter,
        as: "CentroAsignado",
        attributes: ["codigo", "direccion"],
      },
      { model: IdentificationType, attributes: ["tipo_identificacion"] },
      { model: User, as: "Creador", attributes: ["nombre", "apellido"] },
    ],
  });
};

/**
 * @async
 * @function findById
 * @description Busca un usuario específico por su clave primaria (ID) con sus relaciones.
 * @param {number} id - El ID del usuario a buscar.
 * @returns {Promise<User|null>} El objeto del usuario si se encuentra, o null si no.
 */
export const findById = async (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ["contrasena_hash"] },
    include: [
      {
        model: OperationCenter,
        as: "CentroAsignado",
        attributes: ["codigo", "direccion"],
      },
      { model: IdentificationType, attributes: ["tipo_identificacion"] },
      { model: User, as: "Creador", attributes: ["nombre"] },
    ],
  });
};

/**
 * @async
 * @function findByEmail
 * @description Busca un usuario por su correo electrónico. Crucial para el proceso de login.
 * A diferencia de otras funciones, **no excluye** el hash de la contraseña para poder verificarla.
 * @param {string} correo - El correo electrónico del usuario.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<User|null>} El objeto del usuario completo (incluyendo hash) o null.
 */
export const findByEmail = async (correo, options = {}) => {
  return User.findOne({ where: { correo: correo } }, options);
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de usuario en la base de datos.
 * @param {object} userData - Los datos del usuario a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<User>} El objeto del usuario recién creado.
 */
export const create = async (userData, options = {}) => {
  return User.create(userData, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de un usuario existente por su ID.
 * @param {number} id - El ID del usuario a actualizar.
 * @param {object} updateData - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<User|null>} El objeto del usuario actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, updateData, options = {}) => {
  const [rowsAffected] = await User.update(updateData, {
    where: { id_usuario: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id);
  }
  return null;
};

/**
 * @async
 * @function updateLastLogin
 * @description Actualiza el campo `ultimo_login` de un usuario a la fecha y hora actual.
 * @param {number} id - El ID del usuario cuyo último login se va a registrar.
 * @returns {Promise<Array<number>>} Un array con el número de filas afectadas.
 */
export const updateLastLogin = async (id) => {
  return User.update(
    { ultimo_login: new Date() },
    { where: { id_usuario: id } }
  );
};
