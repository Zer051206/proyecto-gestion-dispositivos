/**
 * @file formatDate.js
 * @module DateUtils
 * @description Módulo de utilidad para formatear cadenas de fecha y hora en un formato local consistente.
 */

/**
 * @const {Intl.DateTimeFormatOptions} dateTimeOptions
 * @description Opciones de configuración para el formato de fecha y hora usando `toLocaleString`.
 * Especifica el formato numérico para año, mes y día, y el formato de 2 dígitos (24 horas)
 * para la hora y los minutos.
 */
const dateTimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false, // Formato de 24 horas
};

/**
 * @function formatDate
 * @description Formatea una cadena de fecha a un formato local (`dd/mm/yyyy, hh:mm`).
 * Realiza verificaciones de nulidad e invalidez.
 * @param {string | null | undefined} dateString - La cadena de fecha y hora a formatear (ej: "2023-10-27T10:30:00.000Z").
 * @returns {string} La fecha y hora formateada en español, o "N/A" si la entrada es nula, indefinida o inválida.
 */
export const formatDate = (dateString) => {
  // Retorna "N/A" si la fecha no existe (null o undefined)
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  // Retorna "N/A" si la fecha no es válida (e.g., "Invalid Date")
  if (isNaN(date)) {
    return "N/A";
  }

  // Formatea la fecha usando las opciones definidas
  return date.toLocaleString("es-ES", dateTimeOptions);
};
