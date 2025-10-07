// src/models/Peripheral.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Peripheral = sequelize.define(
    "Peripheral",
    {
      id_periferico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marca_periferico: { type: DataTypes.STRING(150), allowNull: false },
      serial_periferico: { type: DataTypes.STRING(200), allowNull: false },
      periferico_etiquetado: { type: DataTypes.BOOLEAN, allowNull: false },
      etiqueta_periferico: { type: DataTypes.STRING(120), allowNull: true },
      activo_fijo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      codigo_activo_fijo: {
        type: DataTypes.STRING(80),
        allowNull: true,
        unique: true,
      },
      id_tipo_periferico: { type: DataTypes.INTEGER, allowNull: false },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "perifericos", timestamps: false }
  );

  Peripheral.associate = (models) => {
    Peripheral.belongsTo(models.PeripheralType, {
      foreignKey: "id_tipo_periferico",
    });
    Peripheral.belongsTo(models.User, { foreignKey: "id_usuario" });
    Peripheral.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    Peripheral.hasOne(models.Baja, { foreignKey: "id_periferico" });
  };
  return Peripheral;
};
