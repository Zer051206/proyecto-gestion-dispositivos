/**
 * @file RequirementAsset.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'requerimiento_activos'.
 * Esta tabla actúa como enlace (M:M especializado) entre un requerimiento y los activos
 * (equipos o periféricos) que se utilizaron para satisfacerlo, permitiendo la trazabilidad y reasignación.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineRequirementAssetModel
 * @description Define y devuelve el modelo 'RequirementAsset' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'RequirementAsset' definido.
 */
export default (sequelize) => {
  /**
   * @class RequirementAsset
   * @classdesc Modelo de Sequelize para la tabla `requerimiento_activos`.
   * @property {number} id_req_activo - La clave primaria del registro de vinculación.
   * @property {number} id_requerimiento - La clave foránea al requerimiento.
   * @property {number|null} id_equipo - La clave foránea al equipo asignado.
   * @property {number|null} id_periferico - La clave foránea al periférico asignado.
   * @property {Date} fecha_asignacion - La fecha en que se realizó la asignación/vinculación.
   */
  const RequirementAsset = sequelize.define(
    "RequirementAsset",
    {
      id_req_activo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_requerimiento: { type: DataTypes.INTEGER, allowNull: false },
      id_equipo: { type: DataTypes.INTEGER, allowNull: true },
      id_periferico: { type: DataTypes.INTEGER, allowNull: true },
      fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "requerimiento_activos", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo RequirementAsset.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  RequirementAsset.associate = (models) => {
    /**
     * @description Asociación (belongsTo): El registro de activo vinculado pertenece a un único Requerimiento.
     */
    RequirementAsset.belongsTo(models.Requirement, {
      foreignKey: "id_requerimiento",
    });

    /**
     * @description Asociación (belongsTo): El registro se vincula a un único Equipo (si aplica).
     */
    RequirementAsset.belongsTo(models.Device, { foreignKey: "id_equipo" });

    /**
     * @description Asociación (belongsTo): El registro se vincula a un único Periférico (si aplica).
     */
    RequirementAsset.belongsTo(models.Peripheral, {
      foreignKey: "id_periferico",
    });
  };

  return RequirementAsset;
};
