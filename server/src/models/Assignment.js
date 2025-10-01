import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Assignment = sequelize.define(
    "Assignment",
    {
      id_asignacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_asignacion",
      },
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_persona",
        references: {
          model: "personas",
          key: "id_persona",
        },
      },
      id_dispositivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_dispositivo",
        references: {
          model: "dispositivos",
          key: "id_dispositivo",
        },
      },
      fecha_asignacion: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "fecha_asignacion",
      },
      fecha_devolucion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "fecha_devolucion",
      },
    },
    {
      tableName: "asignaciones",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["dispositivo_activo_id"],
          where: {
            fecha_devolucion: null,
          },
        },
      ],
    }
  );

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Person, {
      foreignKey: "id_persona",
      as: "persona",
      onDelete: "RESTRICT",
    });

    Assignment.belongsTo(models.Device, {
      foreignKey: "id_dispositivo",
      as: "dispositivo",
      onDelete: "RESTRICT",
    });
  };

  return Assignment;
};
