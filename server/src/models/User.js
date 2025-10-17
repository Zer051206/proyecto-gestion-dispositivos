/**
 * @file User.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla unificada 'usuarios'.
 * Este modelo es central para la aplicación, representando tanto a los 'Admins' como a los 'Encargados'.
 * Establece todas las relaciones clave, incluyendo las relaciones reflexivas (un usuario creando a otro)
 * y las relaciones duales con los centros de operación (un admin los crea, un encargado es asignado a uno).
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineUserModel
 * @description Define y devuelve el modelo 'User' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'User' definido.
 */
export default (sequelize) => {
  /**
   * @class User
   * @classdesc Modelo de Sequelize para la tabla `usuarios`.
   * @property {number} id_usuario - La clave primaria del usuario.
   * @property {string} nombre - El nombre del usuario.
   * @property {string|null} apellido - El apellido del usuario.
   * @property {string} correo - El correo electrónico único del usuario.
   * @property {string} contrasena_hash - El hash de la contraseña del usuario.
   * @property {number} id_tipo_identificacion - La clave foránea al tipo de identificación.
   * @property {string} identificacion - El número de identificación único del usuario.
   * @property {string|null} telefono - El número de teléfono del usuario.
   * @property {'Admin'|'Encargado'} rol - El rol del usuario dentro de la aplicación.
   * @property {boolean} activo - Indica si la cuenta del usuario está activa.
   * @property {Date|null} ultimo_login - La fecha y hora del último inicio de sesión.
   * @property {number|null} id_creador - La clave foránea al usuario (Admin) que creó este usuario (relación reflexiva).
   * @property {number|null} id_centro_operacion - La clave foránea al centro de operación al que está asignado el usuario (si es 'Encargado').
   */
  const User = sequelize.define(
    "User",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      apellido: { type: DataTypes.STRING(120), allowNull: true }, // Nulo para Admins si se desea
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      contrasena_hash: { type: DataTypes.STRING(255), allowNull: false },
      id_tipo_identificacion: { type: DataTypes.INTEGER, allowNull: false },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      telefono: { type: DataTypes.STRING(20), allowNull: true }, // Nulo para Admins si se desea
      rol: { type: DataTypes.ENUM("Admin", "Encargado"), allowNull: false },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultimo_login: { type: DataTypes.DATE, allowNull: true },
      id_creador: { type: DataTypes.INTEGER, allowNull: true }, // Nulo para el primer admin
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: true }, // Nulo para Admins
    },
    { tableName: "usuarios", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo User con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  User.associate = (models) => {
    // --- Relaciones Reflexivas (User a User) ---
    /**
     * @description Asociación uno-a-muchos: Un Usuario (Admin) puede crear muchos otros Usuarios.
     * @param {Model} models.User - El propio modelo de Usuario.
     * @property {string} as - Alias 'Creados' para esta relación.
     */
    User.hasMany(models.User, { as: "Creados", foreignKey: "id_creador" });
    /**
     * @description Asociación muchos-a-uno: Un Usuario es creado por otro único Usuario (su Creador).
     * @param {Model} models.User - El propio modelo de Usuario.
     * @property {string} as - Alias 'Creador' para esta relación.
     */
    User.belongsTo(models.User, {
      as: "Creador",
      foreignKey: "id_creador",
    });

    // --- Relaciones con Otras Tablas ---

    /**
     * @description Asociación (belongsTo): Un Usuario pertenece a un Tipo de Identificación.
     * @param {Model} models.IdentificationType - El modelo de Tipo de Identificación.
     */
    User.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });

    /**
     * @description Asociación (belongsTo): Un Usuario (Encargado) pertenece a un único Centro de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operacion.
     */
    User.belongsTo(models.OperationCenter, {
      as: "CentroAsignado",
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación (hasMany): Un Usuario (Admin) puede crear muchos Centros de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operacion.
     */
    User.hasMany(models.OperationCenter, {
      as: "CentrosCreados",
      foreignKey: "id_admin_creador",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede tener muchos Refresh Tokens (ej. uno por cada sesión activa en diferentes dispositivos).
     * @param {Model} models.RefreshToken - El modelo de RefreshToken.
     */
    User.hasMany(models.RefreshToken, { foreignKey: "id_usuario" });

    /**
     * @description Asociación (hasMany): Un Usuario puede generar muchos registros de Log a lo largo del tiempo.
     * @param {Model} models.Log - El modelo de Log.
     */
    User.hasMany(models.Log, { foreignKey: "id_usuario" });

    /**
     * @description Asociación (hasMany): Un Usuario puede crear muchos Equipos.
     * @param {Model} models.Device - El modelo de Equipo.
     */
    User.hasMany(models.Device, { foreignKey: "id_usuario_creador" });

    /**
     * @description Asociación (hasMany): Un Usuario puede crear muchos Periféricos.
     * @param {Model} models.Peripheral - El modelo de Periférico.
     */
    User.hasMany(models.Peripheral, {
      foreignKey: "id_usuario_creador",
    });
  };
  return User;
};
