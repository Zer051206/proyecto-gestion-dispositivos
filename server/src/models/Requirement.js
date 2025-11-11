/**
 * @file Requirement.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'requerimientos'.
 * Este modelo representa una solicitud de activos (equipo/periférico) y gestiona
 * el flujo de trabajo de aprobación a través de las diferentes firmas de CO, TI y RH.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineRequirementModel
 * @description Define y devuelve el modelo 'Requirement' de Sequelize.
 * @param {object} sequelize - La instancia de Sequelize.
 * @returns {object} El modelo 'Requirement' definido.
 */
export default (sequelize) => {
  /**
   * @class Requirement
   * @classdesc Modelo de Sequelize para la tabla `requerimientos`.
   * @property {number} id_requerimiento - La clave primaria del requerimiento.
   * @property {string} codigo_requerimiento - El código único de la solicitud.
   * @property {string} asunto - Breve resumen del requerimiento.
   * @property {string} detalle_necesidad - Solicitud de necesidad de negocio del CO.
   * @property {number|null} presupuesto_estimado - Presupuesto final estimado, llenado tras el análisis de TI.
   * @property {Date} fecha_solicitud - Fecha de creación del requerimiento.
   * @property {number} id_estado_requerimiento - FK al estado actual del requerimiento.
   * @property {number} id_centro_operacion - FK al centro de operación solicitante.
   * @property {number} fk_firmante_co_id - FK al usuario que firma/crea desde el CO.
   * @property {Date|null} fecha_firma_co - Fecha de la firma del CO.
   * @property {number|null} fk_firmante_ti_analisis_id - FK al usuario de TI que aprueba el análisis técnico.
   * @property {Date|null} fecha_firma_ti_analisis - Fecha de la firma de análisis de TI.
   * @property {number|null} fk_firmante_rh_pago_id - FK al usuario de RH que aprueba el pago/gasto.
   * @property {Date|null} fecha_firma_rh_pago - Fecha de la firma de RH (Pago).
   * @property {number|null} fk_firmante_ti_listo_id - FK al usuario de TI que confirma que el activo está listo.
   * @property {Date|null} fecha_firma_ti_listo - Fecha de la firma de TI (Listo).
   * @property {number|null} fk_firmante_rh_entrega_id - FK al usuario de RH que aprueba la entrega administrativa.
   * @property {Date|null} fecha_aprobacion_rh_entrega - Fecha de la aprobación de RH (Entrega).
   */
  const Requirement = sequelize.define(
    "Requirement",
    {
      id_requerimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_requerimiento: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      asunto: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      detalle_necesidad: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      presupuesto_estimado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      razon_rechazo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // --- FKs de Relaciones y Estado ---
      id_estado_requerimiento: { type: DataTypes.INTEGER, allowNull: false },
      id_centro_operacion: { type: DataTypes.INTEGER, allowNull: false },

      // --- FKs para Autorizaciones/Firmas ---
      fk_firmante_co_id: { type: DataTypes.INTEGER, allowNull: false },
      fecha_firma_co: { type: DataTypes.DATE, allowNull: true },
      fk_firmante_ti_analisis_id: { type: DataTypes.INTEGER, allowNull: true },
      fecha_firma_ti_analisis: { type: DataTypes.DATE, allowNull: true },
      fk_firmante_rh_pago_id: { type: DataTypes.INTEGER, allowNull: true },
      fecha_firma_rh_pago: { type: DataTypes.DATE, allowNull: true },
      fk_firmante_ti_listo_id: { type: DataTypes.INTEGER, allowNull: true },
      fecha_firma_ti_listo: { type: DataTypes.DATE, allowNull: true },
      fk_firmante_rh_entrega_id: { type: DataTypes.INTEGER, allowNull: true },
      fecha_aprobacion_rh_entrega: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "requerimientos", timestamps: false }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Requirement con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Requirement.associate = (models) => {
    /**
     * @description Asociación (belongsTo): Un Requerimiento pertenece a un único Estado.
     */
    Requirement.belongsTo(models.RequirementStatus, {
      foreignKey: "id_estado_requerimiento",
      as: "Status",
    });

    /**
     * @description Asociación (belongsTo): Un Requerimiento fue solicitado por un Centro de Operación.
     */
    Requirement.belongsTo(models.OperationCenter, {
      foreignKey: "id_centro_operacion",
      as: "CenterOfOperation",
    });

    // --- Asociaciones a Usuarios (Firmantes) ---
    /**
     * @description Asociación (belongsTo): Usuario que origina/firma la solicitud (CO).
     */
    Requirement.belongsTo(models.User, {
      as: "SignerCO",
      foreignKey: "fk_firmante_co_id",
    });

    /**
     * @description Asociación (belongsTo): Usuario que realiza la aprobación del Análisis Técnico (TI).
     */
    Requirement.belongsTo(models.User, {
      as: "SignerTIAnalysis",
      foreignKey: "fk_firmante_ti_analisis_id",
    });

    /**
     * @description Asociación (belongsTo): Usuario que aprueba el pago/gasto (RH).
     */
    Requirement.belongsTo(models.User, {
      as: "SignerRHPayment",
      foreignKey: "fk_firmante_rh_pago_id",
    });

    /**
     * @description Asociación (belongsTo): Usuario que confirma que el activo está listo (TI).
     */
    Requirement.belongsTo(models.User, {
      as: "SignerTIReady",
      foreignKey: "fk_firmante_ti_listo_id",
    });

    /**
     * @description Asociación (belongsTo): Usuario que aprueba la entrega administrativa (RH).
     */
    Requirement.belongsTo(models.User, {
      as: "SignerRHDelivery",
      foreignKey: "fk_firmante_rh_entrega_id",
    });

    // --- Relación con tablas hijas ---
    /**
     * @description Asociación (hasOne): Un Requerimiento tiene un único Análisis Técnico.
     */
    Requirement.hasOne(models.TechnicalAnalysis, {
      foreignKey: "id_requerimiento",
      as: "TechnicalAnalysis",
    });

    /**
     * @description Asociación (hasMany): Un Requerimiento puede tener múltiples Activos vinculados.
     */
    Requirement.hasMany(models.RequirementAsset, {
      foreignKey: "id_requerimiento",
      as: "LinkedAssets",
    });
  };

  return Requirement;
};
