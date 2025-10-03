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
      codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_ciudad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      tableName: "centros_operacion",
      timestamps: false,
    }
  );

  OperationCenter.associate = (models) => {
    OperationCenter.belongsTo(models.User, {
      foreignKey: "id_usuario",
    });

    OperationCenter.belongsTo(models.City, {
      foreignKey: "id_ciudad",
    });

    OperationCenter.hasMany(models.Device, {
      foreignKey: "id_centro_operacion",
    });

    OperationCenter.hasMany(models.Peripheral, {
      foreignKey: "id_centro_operacion",
    });
  };

  return OperationCenter;
};
