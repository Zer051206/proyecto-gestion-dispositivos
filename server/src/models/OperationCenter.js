// src/models/OperationCenter.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OperationCenter = sequelize.define(
    "OperationCenter",
    {
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      id_ciudad: { type: DataTypes.INTEGER, allowNull: false },
      direccion: { type: DataTypes.STRING(150), allowNull: false },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
      },
      id_admin: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "centros_operacion", timestamps: false }
  );

  OperationCenter.associate = (models) => {
    // Un Centro de Operación es creado por UN Admin
    OperationCenter.belongsTo(models.Admin, { foreignKey: "id_admin" });
    // Un Centro de Operación pertenece a UNA Ciudad
    OperationCenter.belongsTo(models.City, { foreignKey: "id_ciudad" });
    // Un Centro de Operación puede tener MUCHOS Usuarios asignados
    OperationCenter.hasMany(models.User, { foreignKey: "id_centro_operacion" });
    // Un Centro de Operación puede tener MUCHOS Equipos
    OperationCenter.hasMany(models.Device, {
      foreignKey: "id_centro_operacion",
    });
    // Un Centro de Operación puede tener MUCHOS Periféricos
    OperationCenter.hasMany(models.Peripheral, {
      foreignKey: "id_centro_operacion",
    });
  };
  return OperationCenter;
};
