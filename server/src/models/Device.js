import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Device = sequelize.define(
    "Device",
    {
      id_dispositivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_dispositivo",
      },
      marca_dispositivo: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "marca_dispositivo",
      },
      serial: {
        type: DataTypes.STRING(120),
        unique: true,
        allowNull: false,
        field: "serial",
      },
      id_tipo_dispositivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_tipo_dispositivo",
        references: {
          model: "tipos_dispositivos",
          key: "id_tipo_dispositivo",
        },
      },
      estado: {
        type: DataTypes.ENUM("Activo", "En mantenimiento", "Baja"),
        allowNull: false,
        defaultValue: "Activo",
        field: "estado",
      },
    },
    {
      tableName: "dispositivos",
      timestamps: false,
    }
  );

  Device.associate = (models) => {
    Device.belongsTo(models.TiposDispositivos, {
      foreignKey: "id_tipo_dispositivo",
      as: "tipo",
      onDelete: "RESTRICT",
    });

    Device.hasMany(models.Asiggnment, {
      foreignKey: "id_dispositivo",
      as: "asignaciones",
      onDelete: "RESTRICT",
    });
  };
  return Device;
};
