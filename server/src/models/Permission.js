/**
 * @file Permission.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'permisos'.
 * Contiene el catálogo de todas las acciones que pueden ser asignadas a los usuarios.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function definePermissionModel
 * @description Define y devuelve el modelo 'Permission' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'Permission' definido.
 */
export default (sequelize) => {
  /**
   * @class Permission
   * @classdesc Modelo de Sequelize para la tabla `permisos`.
   * @property {number} permiso_id - La clave primaria del permiso.
   * @property {string} nombre - El código único del permiso (ej. CAN_SIGN_RH_PAYMENT).
   * @property {string} descripcion - Descripción amigable del permiso.
   * @property {boolean} activo - Indica si el permiso está disponible para asignación.
   */
  const Permission = sequelize.define(
    "Permission",
    {
      permiso_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "permisos", // Nombre de la tabla en la base de datos.
      timestamps: true,
      createdAt: "creado",
      updatedAt: "actualizado",
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Permission con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Permission.associate = (models) => {
    /**
     * @description Asociación (belongsToMany): Un Permiso puede estar asignado a muchos Usuarios.
     * Esta relación utiliza la tabla intermedia 'usuarios_permisos'.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {object} through - La tabla intermedia que gestiona la relación M:N.
     * @property {string} foreignKey - La clave foránea de este modelo ('permiso_id').
     * @property {string} otherKey - La clave del otro modelo ('id_usuario').
     */
    Permission.belongsToMany(models.User, {
      through: "usuarios_permisos",
      foreignKey: "permiso_id",
      otherKey: "id_usuario",
      as: "Users", // Alias de la relación.
    });
  };
  return Permission;
};
