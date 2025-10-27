/**
 * @file City.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'ciudades'.
 * Este modelo representa una ciudad y establece su relación con los Centros de Operación.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineCityModel
 * @description Define y devuelve el modelo 'City' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'City' definido.
 */
export default (sequelize) => {
  /**
   * @class City
   * @description Modelo de Sequelize para la tabla `ciudades`.
   * @property {number} id_ciudad - La clave primaria de la ciudad.
   * @property {string} nombre_ciudad - El nombre de la ciudad.
   */
  const City = sequelize.define(
    "City",
    {
      id_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_ciudad: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nombre_ciudad: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "ciudades",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo City con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  City.associate = (models) => {
    /**
     * @description Asociación uno-a-muchos: Una Ciudad puede tener muchos Centros de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operación.
     * @property {string} foreignKey - La clave foránea en la tabla `centros_operacion`.
     * @property {string} onDelete - La restricción de clave foránea. 'RESTRICT' previene que se
     * elimine una ciudad si todavía hay centros de operación asociados a ella.
     */
    City.hasMany(models.OperationCenter, {
      foreignKey: "id_ciudad",
      onDelete: "RESTRICT",
    });
  };

  return City;
};
