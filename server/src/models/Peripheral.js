/**
 * @file Peripheral.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'perifericos'.
 * Este modelo representa un periférico físico (ej. monitor, teclado) y establece sus relaciones
 * con usuarios, centros de operación, centros de costo y registros de baja.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function definePeripheralModel
 * @description Define y devuelve el modelo 'Peripheral' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'Peripheral' definido.
 */
export default (sequelize) => {
  /**
   * @class Peripheral
   * @classdesc Modelo de Sequelize para la tabla `perifericos`.
   * @property {number} id_periferico - La clave primaria del periférico.
   * @property {string} marca_periferico - La marca del periférico.
   * @property {string} serial_periferico - El número de serial único del periférico.
   * @property {boolean} estado_periferico - El estado actual del periférico (activo/inactivo).
   * @property {boolean} activo_fijo - Indica si el periférico es considerado un activo fijo de la empresa.
   * @property {string|null} codigo_activo_fijo - El código de activo fijo, si aplica.
   * @property {number} id_tipo_periferico - La clave foránea al tipo de periférico.
   * @property {number} id_usuario_creador - La clave foránea al usuario que registró el periférico.
   * @property {number} id_centro_operacion - La clave foránea al centro de operación donde se encuentra el periférico.
   * @property {number|null} id_centro_costo - La clave foránea al centro de costo al que está asignado el periférico.
   */
  const Peripheral = sequelize.define(
    "Peripheral",
    {
      id_periferico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marca_periferico: { type: DataTypes.STRING(150), allowNull: false },
      serial_periferico: { type: DataTypes.STRING(200), allowNull: false },
      estado_periferico: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      activo_fijo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      codigo_activo_fijo: {
        type: DataTypes.STRING(80),
        allowNull: true,
        unique: true,
      },
      id_tipo_periferico: { type: DataTypes.INTEGER, allowNull: false },
      id_usuario_creador: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_costo: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "perifericos", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Peripheral con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Peripheral.associate = (models) => {
    /**
     * @description Asociación (belongsTo): Un Periférico es creado por un único Usuario.
     * @param {Model} models.User - El modelo de Usuario.
     */
    Peripheral.belongsTo(models.User, {
      as: "Creador",
      foreignKey: "id_usuario_creador",
    });

    /**
     * @description Asociación (belongsTo): Un Periférico pertenece a un único Centro de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operación.
     */
    Peripheral.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación (belongsTo): Un Periférico pertenece a un único Tipo de Periférico.
     * @param {Model} models.PeripheralType - El modelo de Tipo de Periférico.
     */
    Peripheral.belongsTo(models.PeripheralType, {
      foreignKey: "id_tipo_periferico",
    });

    /**
     * @description Asociación (belongsTo): Un Periférico puede pertenecer a un único Centro de Costo.
     * @param {Model} models.CostCenter - El modelo de Centro de Costo.
     */
    Peripheral.belongsTo(models.CenterCost, {
      foreignKey: "id_centro_costo",
    });

    /**
     * @description Asociación (hasOne): Un Periférico puede tener un único registro de baja.
     * @param {Model} models.Decommission - El modelo de Baja.
     */
    Peripheral.hasOne(models.Decomission, { foreignKey: "id_periferico" });
  };
  return Peripheral;
};
