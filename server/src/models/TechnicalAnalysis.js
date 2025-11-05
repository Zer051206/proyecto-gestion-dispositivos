/**
 * @file TechnicalAnalysis.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'analisis_tecnico'.
 * Este modelo almacena la decisión técnica de TI sobre un requerimiento, incluyendo
 * el presupuesto, la solución propuesta y la cantidad de activos a adquirir.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineTechnicalAnalysisModel
 * @description Define y devuelve el modelo 'TechnicalAnalysis' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'TechnicalAnalysis' definido.
 */
export default (sequelize) => {
  /**
   * @class TechnicalAnalysis
   * @classdesc Modelo de Sequelize para la tabla `analisis_tecnico`.
   * @property {number} id_analisis - La clave primaria del análisis técnico.
   * @property {number} id_requerimiento - Clave foránea única al requerimiento (relación 1:1).
   * @property {string} descripcion_solucion - Descripción detallada de la solución propuesta por TI.
   * @property {number} cantidad_equipos - Cantidad de equipos (laptops/desktops) necesarios.
   * @property {number} cantidad_perifericos - Cantidad de periféricos necesarios.
   * @property {number} presupuesto_final - Costo total aprobado del análisis.
   * @property {number} fk_analista_ti_id - Clave foránea al usuario de TI que realizó el análisis.
   * @property {Date} fecha_analisis - Fecha en que se completó el análisis.
   */
  const TechnicalAnalysis = sequelize.define(
    "TechnicalAnalysis",
    {
      id_analisis: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_requerimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      descripcion_solucion: { type: DataTypes.TEXT, allowNull: false },
      cantidad_equipos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cantidad_perifericos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      presupuesto_final: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      fk_analista_ti_id: { type: DataTypes.INTEGER, allowNull: false },
      fecha_analisis: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "analisis_tecnico", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo TechnicalAnalysis.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  TechnicalAnalysis.associate = (models) => {
    /**
     * @description Asociación (belongsTo): El Análisis pertenece a un único Requerimiento.
     */
    TechnicalAnalysis.belongsTo(models.Requirement, {
      foreignKey: "id_requerimiento",
    });

    /**
     * @description Asociación (belongsTo): El Análisis fue realizado por un único Usuario (TI).
     */
    TechnicalAnalysis.belongsTo(models.User, {
      as: "AnalistaTI",
      foreignKey: "fk_analista_ti_id",
    });
  };

  return TechnicalAnalysis;
};
