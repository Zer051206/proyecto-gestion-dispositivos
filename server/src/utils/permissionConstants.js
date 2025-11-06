/**
 * @file permissionConstants.js
 * @module Constants
 * @description Define los nombres canónicos de los permisos en el sistema,
 * y mapea los sub-roles de alto nivel (TI, RH) a los permisos granulares requeridos
 * para el flujo de Requerimientos.
 */

/**
 * @const {object} FLOW_PERMISSIONS_MAP
 * @description Mapea los sub-roles booleanos del frontend a la lista de permisos
 * canónicos (nombres exactos en la tabla 'permisos') que el usuario debe recibir.
 */
export const FLOW_PERMISSIONS_MAP = {
  // Permisos necesarios para gestionar el flujo de Requerimientos en la parte de TI
  TI: [
    "CAN_SIGN_TI_ANALYSIS", // Para firmar el análisis técnico
    "CAN_LINK_ASSETS", // Para vincular activos
    "CAN_SIGN_TI_READY", // Para firmar el alistamiento (si aplica)
  ],
  // Permisos necesarios para gestionar el flujo de Requerimientos en la parte de RH
  RH: [
    "CAN_SIGN_RH_PAYMENT", // Para firmar la liberación de pago/compra
    "CAN_SIGN_RH_DELIVERY", // Para firmar la entrega final al usuario
  ],
};
