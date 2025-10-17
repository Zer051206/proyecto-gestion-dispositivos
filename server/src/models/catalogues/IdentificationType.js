/**
 * @file IdentificationType.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'tipos_identificacion'.
 * Este modelo representa un tipo de documento de identidad (ej. 'Cédula de Ciudadanía')
 * y establece su relación con los usuarios.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineIdentificationTypeModel
 * @description Define y devuelve el modelo 'IdentificationType' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'IdentificationType' definido.
 */
export default (sequelize) => {
  /**
   * @class IdentificationType
   * @description Modelo de Sequelize para la tabla `tipos_identificacion`.
   * @property {number} id_tipo_identificacion - La clave primaria del tipo de identificación.
   * @property {string} tipo_identificacion - El nombre del tipo de documento (ej. 'Cédula de Ciudadanía').
   */
  const IdentificationType = sequelize.define(
    "IdentificationType",
    {
      id_tipo_identificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_identificacion: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    },
    {
      tableName: "tipos_identificacion",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo IdentificationType con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  IdentificationType.associate = (models) => {
    /**
     * @description Asociación uno-a-muchos: Un Tipo de Identificación puede estar asociado a muchos Usuarios.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} foreignKey - La clave foránea en la tabla `usuarios`.
     * @property {string} onDelete - La restricción de clave foránea. 'RESTRICT' previene que se
     * elimine un tipo de identificación si todavía hay usuarios con ese tipo de documento.
     */
    IdentificationType.hasMany(models.User, {
      foreignKey: "id_tipo_identificacion",
      onDelete: "RESTRICT",
    });
  };

  return IdentificationType;
};
