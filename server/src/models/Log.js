import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Log = sequelize.define(
    "Log",
    {
      id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_log",
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_usuario",
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
      },
      accion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "accion",
      },
      tabla_afectada: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "tabla_afectada",
      },
      registro_id_afectado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "registro_id_afectado",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "descripcion",
      },
      fecha_log: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "fecha_log",
      },
      ip_usuario: {
        type: DataTypes.STRING(39),
        allowNull: false,
        field: "ip_usuario",
      },
    },
    {
      tableName: "logs",
      timestamps: true,
      createdAt: "fecha_log",
      updatedAt: false,
    }
  );

  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: "id_usuario",
      onDelete: "RESTRICT",
    });
  };

  return Log;
};
