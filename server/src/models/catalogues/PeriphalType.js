import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PeriphalType = sequelize.define(
    "PeriphalType",
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

  PeriphalType.associate = (models) => {
    PeriphalType.hasMany(models.Periphal, {
      foreignKey: "id_tipo_periferico",
      onDelete: "RESTRICT",
    });
  };

  return PeriphalType;
};
