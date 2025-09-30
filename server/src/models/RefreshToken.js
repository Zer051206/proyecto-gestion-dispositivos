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
        field: "id_usuario",
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expira_en: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expira_en",
      },
      revocado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "revocado",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      tableName: "refresh_tokens",
      timestamps: false,
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "id_usuario",
      as: "user",
      onDelete: "CASCADE",
    });
  };
};
