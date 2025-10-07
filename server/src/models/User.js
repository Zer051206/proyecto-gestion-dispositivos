// src/models/User.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      apellido: { type: DataTypes.STRING(120), allowNull: false },
      correo: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      id_tipo_identificacion: { type: DataTypes.INTEGER, allowNull: false },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      telefono: { type: DataTypes.STRING(20), allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      id_admin: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "usuarios", timestamps: false }
  );

  User.associate = (models) => {
    // Un Usuario es creado por UN Admin
    User.belongsTo(models.Admin, { foreignKey: "id_admin" });
    // Un Usuario pertenece a UN Centro de Operación
    User.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    // Un Usuario pertenece a UN Tipo de Identificación
    User.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });
    // Un Usuario puede registrar MUCHOS Equipos
    User.hasMany(models.Device, { foreignKey: "id_usuario" });
    // Un Usuario puede registrar MUCHOS Periféricos
    User.hasMany(models.Peripheral, { foreignKey: "id_usuario" });
  };
  return User;
};
