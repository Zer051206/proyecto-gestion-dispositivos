import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_usuario",
      },
      nombre: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      contrasena_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "contrasena_hash",
      },
      id_oauth: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        field: "id_oauth",
      },
      proveedor_oauth: {
        type: DataTypes.ENUM("google", "microsoft"),
        allowNull: true,
        field: "proveedor_oauth",
      },
      rol: {
        type: DataTypes.ENUM("admin", "inventario"),
        allowNull: false,
        defaultValue: "inventario",
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultimo_login: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_login",
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.RefreshToken, {
      foreignKey: "id_usuario",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Log, {
      foreignKey: "id_usuario",
      onDelete: "RESTRICT",
    });
  };
  return User;
};
