// src/models/RefreshToken.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id_refresh_token: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      expira_en: { type: DataTypes.DATE, allowNull: false },
      id_admin: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "refresh_tokens",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.Admin, {
      foreignKey: "id_admin",
      onDelete: "CASCADE",
    });
  };
  return RefreshToken;
};
