import { DataTypes } from "sequelize";

export default (sequelize) => {
  const City = sequelize.define(
    "City",
    {
      id_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_ciudad: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "ciudades",
      timestamps: false,
    }
  );

  City.associate = (models) => {
    City.hasMany(models.OperationCenter, {
      foreignKey: "id_ciudad",
      onDelete: "RESTRICT",
    });
  };

  return City;
};
