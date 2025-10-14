import db from "../models/index.js";
const User = db.User;
const OperationCenter = db.OperationCenter;
const IdentificationType = db.IdentificationType;

/**
 * Busca todos los usuarios. Excluye el hash de la contraseña por seguridad.
 * @returns {Promise<Array<User>>} Un array de usuarios con su centro de operación.
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
 * Busca un usuario por su ID. Excluye el hash de la contraseña.
 * @param {number} id - El ID del usuario.
 * @returns {Promise<User|null>} El objeto del usuario o null si no se encuentra.
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
 * Busca un usuario por su correo. Devuelve el hash de la contraseña
 * porque esta función se usará para el login.
 * @param {string} correo - El correo del usuario a buscar.
 * @returns {Promise<User|null>} El objeto del usuario completo o null.
 */
export const findByEmail = async (correo, options = {}) => {
  return User.findOne({ where: { correo: correo } }, options);
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Los datos del usuario a crear.
 * @returns {Promise<User>} El objeto del usuario recién creado.
 */
export const create = async (userData, options = {}) => {
  return User.create(userData, options);
};

/**
 * Actualiza un usuario existente.
 * @param {number} id - El ID del usuario a actualizar.
 * @param {object} updateData - Los nuevos datos para el usuario.
 * @returns {Promise<User|null>} El objeto del usuario actualizado o null si no se encontró.
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

export const updateLastLogin = async (id) => {
  return User.update(
    { ultimo_login: new Date() },
    { where: { id_usuario: id } }
  );
};
