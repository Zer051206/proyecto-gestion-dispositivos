/**
 * @file RefreshToken.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'refresh_tokens'.
 * Este modelo es esencial para la estrategia de autenticación, permitiendo la renovación
 * de tokens de acceso (JWT) sin que el usuario tenga que volver a iniciar sesión.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineRefreshTokenModel
 * @description Define y devuelve el modelo 'RefreshToken' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'RefreshToken' definido.
 */
export default (sequelize) => {
  /**
   * @class RefreshToken
   * @classdesc Modelo de Sequelize para la tabla `refresh_tokens`.
   * @property {number} id_refresh_token - La clave primaria del token.
   * @property {string} token - El valor del token, una cadena aleatoria y única.
   * @property {Date} expira_en - La fecha y hora en que el token dejará de ser válido.
   * @property {number} id_usuario - La clave foránea al usuario al que pertenece el token.
   * @property {boolean} revocado - Indica si el token ha sido invalidado (ej. por un logout).
   */
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
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      revocado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "refresh_tokens",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo RefreshToken con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  RefreshToken.associate = (models) => {
    /**
     * @description Asociación (belongsTo): Un Refresh Token pertenece a un único Usuario.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} foreignKey - La clave foránea en la tabla `refresh_tokens`.
     * @property {string} onDelete - 'CASCADE' asegura que si un usuario es eliminado, todos sus
     * refresh tokens asociados también se eliminarán automáticamente.
     */
    RefreshToken.belongsTo(models.User, {
      foreignKey: "id_usuario",
      onDelete: "CASCADE",
    });
  };
  return RefreshToken;
};
