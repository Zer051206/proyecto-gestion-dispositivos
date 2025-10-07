// src/models/Admin.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      correo: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      contrasena_hash: { type: DataTypes.STRING(120), allowNull: false },
      id_tipo_identificacion: { type: DataTypes.INTEGER, allowNull: false },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      ultimo_login: { type: DataTypes.DATE, allowNull: true },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { tableName: "administradores", timestamps: false }
  );

  Admin.associate = (models) => {
    // Un Admin puede crear MUCHOS Centros de Operación
    Admin.hasMany(models.OperationCenter, { foreignKey: "id_admin" });
    // Un Admin puede crear MUCHOS Usuarios
    Admin.hasMany(models.User, { foreignKey: "id_admin" });
    // Un Admin tiene MUCHOS Refresh Tokens
    Admin.hasMany(models.RefreshToken, { foreignKey: "id_admin" });
    // Un Admin puede generar MUCHOS Logs
    Admin.hasMany(models.Log, { foreignKey: "id_admin" });
    // Un Admin pertenece a UN Tipo de Identificación
    Admin.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });
  };
  return Admin;
};
