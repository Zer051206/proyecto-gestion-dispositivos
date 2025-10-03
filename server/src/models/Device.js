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
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serial: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      equipo_laptop: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      tamano_disco_duro: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      equipo_tarjeta_grafica: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      referencia_tarjeta_grafica: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      serial_pantalla: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      equipo_alquilado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      estado_equipo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      equipo_etiquetado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      equipo_etiqueta: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
    },
    {
      tableName: "equipos",
      timestamps: false,
    }
  );

  Device.associate = (models) => {
    Device.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });

    Device.hasOne(models.Decommission, {
      foreignKey: "id_equipo",
    });
  };

  return Device;
};
