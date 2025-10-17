/**
 * @file PeripheralType.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'tipos_perifericos'.
 * Este modelo representa una categoría de periférico (ej. 'Monitor', 'Teclado')
 * y establece su relación con los periféricos individuales.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function definePeripheralTypeModel
 * @description Define y devuelve el modelo 'PeripheralType' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'PeripheralType' definido.
 */
export default (sequelize) => {
  /**
   * @class PeripheralType
   * @description Modelo de Sequelize para la tabla `tipos_perifericos`.
   * @property {number} id_tipo_periferico - La clave primaria del tipo de periférico.
   * @property {string} tipo_periferico - El nombre del tipo de periférico (ej. 'Monitor').
   */
  const PeripheralType = sequelize.define(
    "PeripheralType",
    {
      id_tipo_periferico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_periferico: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
    },
    {
      tableName: "tipos_perifericos",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo PeripheralType con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  PeripheralType.associate = (models) => {
    /**
     * @description Asociación uno-a-muchos: Un Tipo de Periférico puede tener muchos Periféricos.
     * @param {Model} models.Peripheral - El modelo de Periférico.
     * @property {string} foreignKey - La clave foránea en la tabla `perifericos`.
     * @property {string} onDelete - La restricción de clave foránea. 'RESTRICT' previene que se
     * elimine un tipo de periférico si todavía hay periféricos de ese tipo registrados.
     */
    PeripheralType.hasMany(models.Peripheral, {
      foreignKey: "id_tipo_periferico",
      onDelete: "RESTRICT",
    });
  };

  return PeripheralType;
};
