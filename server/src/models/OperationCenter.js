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
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      id_admin_creador: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "centros_operacion", timestamps: false }
  );

  OperationCenter.associate = (models) => {
    OperationCenter.belongsTo(models.User, {
      as: "AdminCreador",
      foreignKey: "id_admin_creador",
    });
    OperationCenter.belongsTo(models.City, { foreignKey: "id_ciudad" });
    OperationCenter.hasMany(models.User, { foreignKey: "id_centro_operacion" });
    OperationCenter.hasMany(models.Device, {
      foreignKey: "id_centro_operacion",
    });
    OperationCenter.hasMany(models.Peripheral, {
      foreignKey: "id_centro_operacion",
    });
  };
  return OperationCenter;
};
