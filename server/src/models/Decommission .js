/**
 * @file Decommission.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'bajas'.
 * Este modelo representa el registro de un evento de "baja" de un activo,
 * ya sea un equipo o un periférico, y quién realizó la acción.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineDecommissionModel
 * @description Define y devuelve el modelo 'Decommission' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'Decommission' definido.
 */
export default (sequelize) => {
  /**
   * @class Decommission
   * @classdesc Modelo de Sequelize para la tabla `bajas`.
   * @property {number} id_baja - La clave primaria del registro de baja.
   * @property {number|null} id_periferico - La clave foránea al periférico dado de baja (si aplica).
   * @property {number|null} id_equipo - La clave foránea al equipo dado de baja (si aplica).
   * @property {number} id_usuario - La clave foránea al usuario que realizó la baja.
   * @property {Date} fecha_baja - La fecha y hora en que se registró la baja.
   */
  const Decomission = sequelize.define(
    "Decomission",
    {
      id_baja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_periferico: { type: DataTypes.INTEGER, allowNull: true },
      id_equipo: { type: DataTypes.INTEGER, allowNull: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      fecha_baja: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "bajas", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Decommission con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Decomission.associate = (models) => {
    /**
     * @description Asociación muchos-a-uno: Un registro de baja pertenece a un único Usuario.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} foreignKey - La clave foránea en la tabla `bajas`.
     */
    Decomission.belongsTo(models.User, { foreignKey: "id_usuario" });

    /**
     * @description Asociación muchos-a-uno: Un registro de baja puede pertenecer a un único Equipo.
     * @param {Model} models.Device - El modelo de Equipo.
     * @property {string} foreignKey - La clave foránea en la tabla `bajas`.
     */
    Decomission.belongsTo(models.Device, { foreignKey: "id_equipo" });

    /**
     * @description Asociación muchos-a-uno: Un registro de baja puede pertenecer a un único Periférico.
     * @param {Model} models.Peripheral - El modelo de Periférico.
     * @property {string} foreignKey - La clave foránea en la tabla `bajas`.
     */
    Decomission.belongsTo(models.Peripheral, { foreignKey: "id_periferico" });
  };
  return Decomission;
};
