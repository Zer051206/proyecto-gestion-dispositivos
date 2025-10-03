import { DataTypes } from "sequelize";

export default (sequelize) => {
  const IdentificationType = sequelize.define(
    "IdentificationType",
    {
      id_tipo_identificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_identificacion: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    },
    {
      tableName: "tipos_identificacion",
      timestamps: false,
    }
  );

  IdentificationType.associate = (models) => {
    IdentificationType.hasMany(models.User, {
      foreignKey: "id_tipo_identificacion",
      onDelete: "RESTRICT",
    });
  };

  return IdentificationType;
};
