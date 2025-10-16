import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Device = sequelize.define(
    "Device",
    {
      id_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serial: { type: DataTypes.STRING(255), allowNull: false },
      equipo_laptop: { type: DataTypes.BOOLEAN, allowNull: false },
      tamano_disco_duro: { type: DataTypes.BIGINT, allowNull: false },
      equipo_tarjeta_grafica: { type: DataTypes.BOOLEAN, allowNull: false },
      referencia_tarjeta_grafica: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      serial_pantalla: { type: DataTypes.STRING(255), allowNull: true },
      equipo_alquilado: { type: DataTypes.BOOLEAN, allowNull: false },
      empresa_alquila: { type: DataTypes.STRING(180), allowNull: true },
      estado_equipo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
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
      id_usuario_creador: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_costo: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "equipos", timestamps: false }
  );

  Device.associate = (models) => {
    Device.belongsTo(models.User, {
      as: "Creador",
      foreignKey: "id_usuario_creador",
    });
    Device.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    Device.hasOne(models.Decomission, { foreignKey: "id_equipo" });

    Device.belongsTo(models.CenterCost, {
      foreignKey: "id_centro_costo",
    });
  };
  return Device;
};
