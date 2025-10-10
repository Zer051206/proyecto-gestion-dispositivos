// src/models/Decomission.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Decomission = sequelize.define(
    "Decomission",
    {
      id_baja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_periferico: { type: DataTypes.INTEGER, allowNull: true },
      id_equipo: { type: DataTypes.INTEGER, allowNull: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      fecha_baja: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "bajas", timestamps: false }
  );

  Decomission.associate = (models) => {
    Decomission.belongsTo(models.User, { foreignKey: "id_usuario" });
    Decomission.belongsTo(models.Device, { foreignKey: "id_equipo" });
    Decomission.belongsTo(models.Peripheral, { foreignKey: "id_periferico" });
  };
  return Decomission;
};
