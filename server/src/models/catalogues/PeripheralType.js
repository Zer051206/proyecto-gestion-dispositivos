import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PeripheralType = sequelize.define(
    "PeripheralType",
    {
      id_tipo_periferico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_periferico: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
    },
    {
      tableName: "tipos_perifericos",
      timestamps: false,
    }
  );

  PeripheralType.associate = (models) => {
    PeripheralType.hasMany(models.Peripheral, {
      foreignKey: "id_tipo_periferico",
      onDelete: "RESTRICT",
    });
  };

  return PeripheralType;
};
