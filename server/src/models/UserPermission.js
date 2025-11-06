/**
 * @file UserPermission.js
 * @module Models
 * @description Modelo explícito para la tabla pivote usuarios_permisos.
 * Es necesario para asegurar que Sequelize no intente buscar timestamps.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserPermission = sequelize.define(
    "UserPermission",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permiso_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "usuarios_permisos",
      timestamps: false,
    }
  );
  // No necesita asociación, es solo una tabla de unión.
  return UserPermission;
};
