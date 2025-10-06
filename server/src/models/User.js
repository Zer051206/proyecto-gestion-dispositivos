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
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
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
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM("Inventario", "Admin"),
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultimo_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "usuarios",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });
    User.hasMany(models.OperationCenter, {
      foreignKey: "id_usuario",
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: "id_usuario",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Log, {
      foreignKey: "id_usuario",
    });
  };

  return User;
};
