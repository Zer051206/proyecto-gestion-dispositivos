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
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      apellido: { type: DataTypes.STRING(120), allowNull: true }, // Nulo para Admins si se desea
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      contrasena_hash: { type: DataTypes.STRING(255), allowNull: false },
      id_tipo_identificacion: { type: DataTypes.INTEGER, allowNull: false },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      telefono: { type: DataTypes.STRING(20), allowNull: true }, // Nulo para Admins si se desea
      rol: { type: DataTypes.ENUM("Admin", "Encargado"), allowNull: false },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultimo_login: { type: DataTypes.DATE, allowNull: true },
      id_creador: { type: DataTypes.INTEGER, allowNull: true }, // Nulo para el primer admin
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: true }, // Nulo para Admins
    },
    { tableName: "usuarios", timestamps: false }
  );

  User.associate = (models) => {
    User.hasMany(models.User, { as: "Creados", foreignKey: "id_creador" });
    User.belongsTo(models.User, { as: "Creador", foreignKey: "id_creador" });

    // Otras relaciones
    User.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });
    User.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    User.hasMany(models.RefreshToken, { foreignKey: "id_usuario" });
    User.hasMany(models.Log, { foreignKey: "id_usuario" });
    User.hasMany(models.Device, { foreignKey: "id_usuario_creador" });
  };
  return User;
};
