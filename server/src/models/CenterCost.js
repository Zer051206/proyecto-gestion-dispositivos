/**
 * @file CostCenter.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'centro_costos'.
 * Este modelo representa una subdivisión o área dentro de un Centro de Operación (ej. 'Bodega', 'Cajas')
 * y establece sus relaciones con los activos (Equipos y Periféricos) que pueden ser asignados a él.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineCostCenterModel
 * @description Define y devuelve el modelo 'CostCenter' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'CostCenter' definido.
 */
export default (sequelize) => {
  /**
   * @class CostCenter
   * @description Modelo de Sequelize para la tabla `centro_costos`.
   * @property {number} id_centro_costo - La clave primaria del centro de costo.
   * @property {string} codigo_centro_costo - Un código único para el centro de costo.
   * @property {string} centro_costo - El nombre descriptivo del centro de costo (ej. 'Administración').
   * @property {number} id_centro_operacion - La clave foránea que lo asocia a un Centro de Operación.
   */
  const CenterCost = sequelize.define(
    "CenterCost",
    {
      id_centro_costo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_centro_costo: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      centro_costo: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "centro_costos",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo CostCenter con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  CenterCost.associate = (models) => {
    /**
     * @description Asociación muchos-a-uno: Un Centro de Costo pertenece a un único Centro de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operación.
     * @property {string} foreignKey - La clave foránea en la tabla `centro_costos`.
     */
    CenterCost.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });
    /**
     * @description Asociación uno-a-muchos: Un Centro de Costo puede tener muchos Equipos asignados.
     * @param {Model} models.Device - El modelo de Equipo.
     * @property {string} foreignKey - La clave foránea en la tabla `equipos`.
     */
    CenterCost.hasMany(models.Device, {
      foreignKey: "id_centro_costo",
    });
    /**
     * @description Asociación uno-a-muchos: Un Centro de Costo puede tener muchos Periféricos asignados.
     * @param {Model} models.Peripheral - El modelo de Periférico.
     * @property {string} foreignKey - La clave foránea en la tabla `perifericos`.
     */
    CenterCost.hasMany(models.Peripheral, {
      foreignKey: "id_centro_costo",
    });
  };

  return CenterCost;
};
