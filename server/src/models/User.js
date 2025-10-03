// src/models/User.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      // Este es el campo para la clave foránea
      id_tipo_identificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      contrasena_hash: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "contrasena_hash",
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM("Inventario", "Admin"),
        allowNull: false,
      },
    },
    {
      tableName: "usuarios",
      // Tu tabla no tiene columnas 'createdAt' o 'updatedAt',
      // así que debemos desactivar los timestamps de Sequelize.
      timestamps: false,
    }
  );

  // Aquí definimos las relaciones (asociaciones)
  User.associate = (models) => {
    User.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });

    User.hasMany(models.OperationCenter, {
      foreignKey: "id_User",
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: "id_User",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Log, {
      foreignKey: "id_User",
    });
  };

  return User;
};
