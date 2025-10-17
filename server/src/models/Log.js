/**
 * @file Log.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'logs'.
 * Este modelo representa un registro de auditoría para cada acción importante
 * que ocurre en la aplicación, como la creación de un usuario o la baja de un activo.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineLogModel
 * @description Define y devuelve el modelo 'Log' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'Log' definido.
 */
export default (sequelize) => {
  /**
   * @class Log
   * @classdesc Modelo de Sequelize para la tabla `logs`.
   * @property {number} id_log - La clave primaria del registro de log.
   * @property {string} accion - Una cadena que describe la acción realizada (ej. "CREAR_USUARIO").
   * @property {string|null} descripcion - Un texto detallado que describe el evento.
   * @property {string} ip_usuario - La dirección IP del usuario que realizó la acción.
   * @property {number} id_usuario - La clave foránea al usuario que realizó la acción.
   */
  const Log = sequelize.define(
    "Log",
    {
      id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accion: { type: DataTypes.STRING(255), allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: true },
      ip_usuario: { type: DataTypes.STRING(39), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "logs",
      timestamps: true,
      createdAt: "fecha_log",
      updatedAt: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Log con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Log.associate = (models) => {
    /**
     * @description Asociación muchos-a-uno: Un registro de Log pertenece a un único Usuario.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} foreignKey - La clave foránea en la tabla `logs`.
     */
    Log.belongsTo(models.User, { foreignKey: "id_usuario" });
  };
  return Log;
};
