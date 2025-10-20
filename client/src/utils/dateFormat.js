/**
 * @file dateFormat.js
 * @module DateUtils
 * @description Módulo de utilidad para formatear cadenas de fecha y hora a la zona horaria local de Colombia (UTC-5).
 * Esta implementación utiliza el objeto `Date` nativo de JavaScript para realizar la conversión de zona horaria manualmente.
 */

/**
 * @function formatDate
 * @description Formatea una cadena de fecha (que se asume UTC) a un formato local de Colombia.
 * @param {string | Date | null | undefined} dateInput - La cadena de fecha UTC (ej: "2023-10-27T19:30:00.000Z").
 * @returns {string} La fecha y hora formateada, o "N/A" si la entrada es inválida.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) {
    return "N/A";
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date)) {
      return "Fecha inválida";
    }

    // 1. Obtenemos los componentes de la fecha en UTC.
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // 0-11
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // 2. Creamos una nueva fecha aplicando el desfase de Colombia (UTC-5).
    // El constructor de Date maneja correctamente los desbordamientos (ej. si la hora es 2 AM UTC, al restarle 5 se convierte en 9 PM del día anterior).
    const colombiaDate = new Date(
      Date.UTC(year, month, day, hours - 5, minutes, seconds)
    );

    // 3. Extraemos los componentes de la nueva fecha ajustada.
    const finalDay = String(colombiaDate.getDate()).padStart(2, "0");
    const finalMonth = String(colombiaDate.getMonth() + 1).padStart(2, "0"); // Se suma 1 porque los meses van de 0 a 11.
    const finalYear = colombiaDate.getFullYear();
    let finalHours = colombiaDate.getHours();
    const finalMinutes = String(colombiaDate.getMinutes()).padStart(2, "0");
    const finalSeconds = String(colombiaDate.getSeconds()).padStart(2, "0");

    // 4. Convertimos a formato 12h (AM/PM).
    const ampm = finalHours >= 12 ? "p. m." : "a. m.";
    finalHours = finalHours % 12;
    finalHours = finalHours ? finalHours : 12; // La hora 0 debe ser 12.

    // 5. Ensamblamos la cadena de texto final.
    return `${finalDay}/${finalMonth}/${finalYear}, ${finalHours}:${finalMinutes}:${finalSeconds} ${ampm}`;
  } catch (error) {
    console.error("Error al formatear la fecha:", error);
    return "Fecha inválida";
  }
};
