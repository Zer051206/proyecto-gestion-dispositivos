// src/models/Log.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Log = sequelize.define(
    "Log",
    {
      id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accion: { type: DataTypes.STRING(255), allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: true },
      ip_usuario: { type: DataTypes.STRING(39), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER, allowNull: true },
      id_admin: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "logs",
      timestamps: true,
      createdAt: "fecha_log",
      updatedAt: false,
    }
  );

  Log.associate = (models) => {
    Log.belongsTo(models.User, { foreignKey: "id_usuario" });
    Log.belongsTo(models.Admin, { foreignKey: "id_admin" });
  };
  return Log;
};
