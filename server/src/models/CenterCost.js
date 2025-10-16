import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CenterCost = sequelize.define(
    "CenterCost",
    {
      id_centro_costo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_centro_costo: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      centro_costo: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "centro_costos",
      timestamps: false,
    }
  );

  CenterCost.associate = (models) => {
    // Un Centro de Costo pertenece a UN Centro de Operación
    CenterCost.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    // Un Centro de Costo puede tener MUCHOS Equipos
    CenterCost.hasMany(models.Device, {
      foreignKey: "id_centro_costo",
    });
    // Un Centro de Costo puede tener MUCHOS Periféricos
    CenterCost.hasMany(models.Peripheral, {
      foreignKey: "id_centro_costo",
    });
  };

  return CenterCost;
};
