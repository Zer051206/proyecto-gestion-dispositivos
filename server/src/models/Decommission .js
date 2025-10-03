import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Decommission = sequelize.define(
    "Decommission",
    {
      id_baja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_periferico: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_equipo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha_baja: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "bajas",
      timestamps: false,
    }
  );

  /*
   * NOTA IMPORTANTE SOBRE LA LÓGICA DE 'bajas':
   * La regla de negocio de que una baja debe tener un id_periferico O un id_equipo,
   * pero no ambos, está definida en la base de datos con una restricción CHECK.
   * ¡Esto es perfecto! La base de datos es el mejor lugar para garantizar la integridad
   * de los datos. El modelo de Sequelize solo necesita saber que estos campos
   * PUEDEN ser nulos (`allowNull: true`). La base de datos se encargará de rechazar
   * cualquier inserción o actualización que no cumpla la regla.
   */
  Decommission.associate = (models) => {
    Decommission.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });

    Decommission.belongsTo(models.Device, {
      foreignKey: "id_equipo",
    });

    Decommission.belongsTo(models.Peripheral, {
      foreignKey: "id_periferico",
    });
  };

  return Decommission;
};
