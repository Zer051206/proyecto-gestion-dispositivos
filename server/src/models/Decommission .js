// src/models/Baja.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Baja = sequelize.define(
    "Baja",
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

  Baja.associate = (models) => {
    Baja.belongsTo(models.User, { foreignKey: "id_usuario" });
    Baja.belongsTo(models.Device, { foreignKey: "id_equipo" });
    Baja.belongsTo(models.Peripheral, { foreignKey: "id_periferico" });
  };
  return Baja;
};
