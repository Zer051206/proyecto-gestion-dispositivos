/**
 * @file RequirementStatus.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla catálogo 'estados_requerimiento'.
 * Contiene la lista de estados que definen el flujo de un requerimiento (Ej: Pendiente TI, En Alistamiento).
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineRequirementStatusModel
 * @description Define y devuelve el modelo 'RequirementStatus' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'RequirementStatus' definido.
 */
export default (sequelize) => {
  /**
   * @class RequirementStatus
   * @classdesc Modelo de Sequelize para la tabla `estados_requerimiento`.
   * @property {number} id_estado_requerimiento - La clave primaria del estado.
   * @property {string} nombre_estado - El nombre descriptivo del estado.
   * @property {string} descripcion - Descripción opcional del estado.
   */
  const RequirementStatus = sequelize.define(
    "RequirementStatus",
    {
      id_estado_requerimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_estado: { type: DataTypes.STRING(100), allowNull: false },
      descripcion: { type: DataTypes.STRING(255), allowNull: true },
    },
    { tableName: "estados_requerimiento", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo RequirementStatus.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  RequirementStatus.associate = (models) => {
    /**
     * @description Asociación (hasMany): Un estado puede tener múltiples Requerimientos asociados.
     */
    RequirementStatus.hasMany(models.Requirement, {
      foreignKey: "id_estado_requerimiento",
    });
  };

  return RequirementStatus;
};
