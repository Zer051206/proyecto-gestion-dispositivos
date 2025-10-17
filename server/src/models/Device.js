/**
 * @file Device.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'equipos'.
 * Este modelo representa un equipo físico (PC o laptop) y establece sus relaciones
 * con los usuarios, centros de operación, centros de costo y registros de baja.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineDeviceModel
 * @description Define y devuelve el modelo 'Device' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'Device' definido.
 */
export default (sequelize) => {
  /**
   * @class Device
   * @classdesc Modelo de Sequelize para la tabla `equipos`.
   * @property {number} id_equipo - La clave primaria del equipo.
   * @property {string} serial - El número de serial único del equipo.
   * @property {boolean} equipo_laptop - Indica si el equipo es una laptop (true) o de escritorio (false).
   * @property {number} tamano_disco_duro - El tamaño del disco duro en Gigabytes.
   * @property {boolean} equipo_tarjeta_grafica - Indica si el equipo tiene una tarjeta gráfica dedicada.
   * @property {string|null} referencia_tarjeta_grafica - La referencia de la tarjeta gráfica, si aplica.
   * @property {string|null} serial_pantalla - El serial del monitor asociado, para equipos de escritorio.
   * @property {boolean} equipo_alquilado - Indica si el equipo es alquilado.
   * @property {string|null} empresa_alquila - El nombre de la empresa que alquila el equipo, si aplica.
   * @property {boolean} estado_equipo - El estado actual del equipo (activo/inactivo).
   * @property {boolean} activo_fijo - Indica si el equipo es considerado un activo fijo de la empresa.
   * @property {string|null} codigo_activo_fijo - El código de activo fijo, si aplica.
   * @property {number} id_usuario_creador - La clave foránea al usuario que registró el equipo.
   * @property {number} id_centro_operacion - La clave foránea al centro de operación donde se encuentra el equipo.
   * @property {number|null} id_centro_costo - La clave foránea al centro de costo al que está asignado el equipo.
   */
  const Device = sequelize.define(
    "Device",
    {
      id_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serial: { type: DataTypes.STRING(255), allowNull: false },
      equipo_laptop: { type: DataTypes.BOOLEAN, allowNull: false },
      tamano_disco_duro: { type: DataTypes.BIGINT, allowNull: false },
      equipo_tarjeta_grafica: { type: DataTypes.BOOLEAN, allowNull: false },
      referencia_tarjeta_grafica: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      serial_pantalla: { type: DataTypes.STRING(255), allowNull: true },
      equipo_alquilado: { type: DataTypes.BOOLEAN, allowNull: false },
      empresa_alquila: { type: DataTypes.STRING(180), allowNull: true },
      estado_equipo: {
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
      id_usuario_creador: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_costo: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "equipos", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Device con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Device.associate = (models) => {
    /**
     * @description Asociación muchos-a-uno: Un Equipo es creado por un único Usuario.
     * @param {Model} models.User - El modelo de Usuario.
     * @property {string} as - El alias de la asociación para consultas.
     * @property {string} foreignKey - La clave foránea en la tabla `equipos`.
     */
    Device.belongsTo(models.User, {
      as: "Creador",
      foreignKey: "id_usuario_creador",
    });

    /**
     * @description Asociación muchos-a-uno: Un Equipo pertenece a un único Centro de Operación.
     * @param {Model} models.OperationCenter - El modelo de Centro de Operación.
     * @property {string} foreignKey - La clave foránea en la tabla `equipos`.
     */
    Device.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
    });

    /**
     * @description Asociación uno-a-uno: Un Equipo puede tener un único registro de baja.
     * @param {Model} models.Decommission - El modelo de Baja.
     * @property {string} foreignKey - La clave foránea en la tabla `bajas`.
     */
    Device.hasOne(models.Decomission, { foreignKey: "id_equipo" });

    /**
     * @description Asociación muchos-a-uno: Un Equipo puede pertenecer a un único Centro de Costo.
     * @param {Model} models.CostCenter - El modelo de Centro de Costo.
     * @property {string} foreignKey - La clave foránea en la tabla `equipos`.
     */
    Device.belongsTo(models.CenterCost, {
      foreignKey: "id_centro_costo",
    });
  };
  return Device;
};
