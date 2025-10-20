/**
 * @file OperationCenter.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'centros_operacion'.
 * Este modelo representa una ubicación física o tienda y establece sus relaciones
 * con usuarios, ciudades, activos y centros de costo.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineOperationCenterModel
 * @description Define y devuelve el modelo 'OperationCenter' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'OperationCenter' definido.
 */
export default (sequelize) => {
  /**
   * @class OperationCenter
   * @classdesc Modelo de Sequelize para la tabla `centros_operacion`.
   * @property {number} id_centro_operacion - La clave primaria del centro de operación.
   * @property {string} codigo - El código único que identifica al centro de operación.
   * @property {number} id_ciudad - La clave foránea a la ciudad donde se ubica el centro.
   * @property {string} direccion - La dirección física del centro.
   * @property {string} correo - El correo electrónico de contacto del centro.
   * @property {string} telefono - El número de teléfono de contacto del centro.
   * @property {boolean} activo - El estado actual del centro (activo/inactivo).
   * @property {number} id_admin_creador - La clave foránea al usuario (Admin) que registró el centro.
   */
  const OperationCenter = sequelize.define(
    "OperationCenter",
    {
      id_centro_operacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo: { type: DataTypes.STRING(10), allowNull: false, unique: true },
      id_ciudad: { type: DataTypes.INTEGER, allowNull: false },
      direccion: { type: DataTypes.STRING(150), allowNull: false },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      id_admin_creador: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "centros_operacion", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo OperationCenter con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  OperationCenter.associate = (models) => {
    /**
     * @description Asociación (belongsTo): Un Centro de Operación es creado por un único Usuario (Admin).
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} as - Alias 'AdminCreador' para esta relación específica.
     * @property {string} foreignKey - La clave foránea en la tabla `centros_operacion`.
     */
    OperationCenter.belongsTo(models.User, {
      as: "AdminCreador",
      foreignKey: "id_admin_creador",
    });

    /**
     * @description Asociación (belongsTo): Un Centro de Operación pertenece a una única Ciudad.
     * @param {Model} models.City - El modelo de Ciudad.
     * @property {string} foreignKey - La clave foránea en la tabla `centros_operacion`.
     */
    OperationCenter.belongsTo(models.City, { foreignKey: "id_ciudad" });

    /**
     * @description Asociación (hasMany): Un Centro de Operación puede tener muchos Usuarios (Encargados) asignados.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} as - Alias 'EncargadosAsignados' para esta relación.
     * @property {string} foreignKey - La clave foránea en la tabla `usuarios`.
     */
    OperationCenter.hasMany(models.User, {
      as: "EncargadosAsignados",
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación (hasMany): Un Centro de Operación puede tener muchos Equipos.
     * @param {Model} models.Device - El modelo de Equipo.
     * @property {string} foreignKey - La clave foránea en la tabla `equipos`.
     */
    OperationCenter.hasMany(models.Device, {
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación (hasMany): Un Centro de Operación puede tener muchos Periféricos.
     * @param {Model} models.Peripheral - El modelo de Periférico.
     * @property {string} foreignKey - La clave foránea en la tabla `perifericos`.
     */
    OperationCenter.hasMany(models.Peripheral, {
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación (hasMany): Un Centro de Operación puede tener muchos Centros de Costo.
     * @param {Model} models.CostCenter - El modelo de Centro de Costo.
     * @property {string} foreignKey - La clave foránea en la tabla `centro_costos`.
     */
    OperationCenter.hasMany(models.CenterCost, {
      foreignKey: "id_centro_operacion",
    });
  };
  return OperationCenter;
};
