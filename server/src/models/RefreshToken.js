import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id_refresh_token: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_refresh_token",
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expira_en: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revocado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "refresh_tokens",
      timestamps: true,
      createdAt: "creado_en",
      updatedAt: false,
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "id_usuario",
      onDelete: "CASCADE",
    });
  };

  return RefreshToken;
};
