/**
 * @file DetailModal.jsx
 * @module Components/UI
 * @description Componente de modal dinámico y reutilizable.
 * Renderiza una lista de propiedades de un objeto 'item' basado en un 'config' array.
 * @requires react
 */
import React from "react";

/**
 * @function getNestedValue
 * @description Auxiliar para obtener un valor de un objeto usando un path de string (ej. "Area.nombre_area").
 * @param {object} obj - El objeto del cual extraer el valor.
 * @param {string} path - La ruta de la propiedad (ej. "propiedad" o "prop.anidada").
 * @returns {*} El valor encontrado o "N/A".
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  // Divide el path por '.' y recorre el objeto
  const value = path.split(".").reduce((acc, part) => {
    // Si acc (acumulador) es nulo o undefined, retorna nulo para evitar errores
    if (acc === null || acc === undefined) {
      return null;
    }
    return acc[part];
  }, obj);

  return value !== null && value !== undefined ? value : null;
};

/**
 * @function DetailRow
 * @description Subcomponente para renderizar una fila de label/valor.
 * @param {object} props
 * @param {string} props.label - Etiqueta para la fila.
 * @param {string|number} props.value - Valor a mostrar.
 * @returns {JSX.Element}
 */
const DetailRow = ({ label, value, multiline }) => (
  <div className="text-base text-text-main">
    <strong className="font-semibold text-text-main/70">{label}:</strong>
    {multiline ? (
      <p className="mt-1 p-2 bg-surface-light rounded-md whitespace-pre-wrap">
        {value}
      </p>
    ) : (
      <span className="ml-1">{value}</span>
    )}
  </div>
);

/**
 * @function DetailModal
 * @description Modal dinámico que renderiza detalles de un item.
 * @param {object} props
 * @param {object} props.item - El objeto con los datos (visita, paquete, vehiculo).
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {string} props.title - Título del modal.
 * @param {Array<object>} props.config - Array de configuración para las filas.
 * @param {Function} [props.formatDate] - Función opcional para formatear fechas.
 * @param {string} [props.themeColor="primary"] - Color del tema (ej. 'primary' o 'secondary').
 * @returns {JSX.Element|null}
 */
export default function DetailModal({
  item,
  onClose,
  title,
  config,
  formatDate,
  themeColor = "primary", // Color por defecto
  layoutType = "single",
}) {
  console.log("🚀 ~ DetailModal ~ item:", item);
  if (!item) return null;

  const titleColor = `text-${themeColor}`; // ej. text-primary
  const buttonClass = `bg-${themeColor} text-surface hover:bg-${themeColor}-hover`; // ej. bg-primary...

  const idTwoColumns = layoutType === "two-column";

  const contentContainerClasses = idTwoColumns
    ? "overflow-x-auto max-h-[80vh] pt-2" // Scroll horizontal para 3 columnas
    : "space-y-4 max-h-[80vh] overflow-y-auto pr-2"; // Stack vertical para un solo módulo

  // Clases dinámicas para el contenedor del grid/stack
  const gridClasses = idTwoColumns
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-4 w-max min-w-full"
    : "space-y-4"; // Si no es 3 columnas, volvemos al stack vertical

  // Ancho del modal
  const modalWidth = idTwoColumns ? "max-w-6xl" : "max-w-md";

  return (
    <div className="fixed inset-0 bg-text-main/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        className={`relative bg-background p-4 rounded-lg shadow-2xl w-screen mt-[100px] md:mt-[50px] mb-4 ${modalWidth} animate-fadeIn`}
        key={item.id_visita || item.id_paquete || item.id_vehiculo || "modal"}
      >
        <h3
          className={`text-2xl font-bold ${titleColor} mb-2 text-center border-b pb-2`}
        >
          {title}
        </h3>

        {/* --- Contenedor Principal para el SCROLL y Layout --- */}
        <div className={contentContainerClasses}>
          <div className={gridClasses}>
            {config.map((prop, index) => {
              // --- 1. Lógica de Divisores ---
              if (prop.isDivider) {
                // El divisor debe ocupar el ancho completo, independientemente del layout
                const dividerClass = idTwoColumns ? "col-span-full" : "";
                return (
                  <h4
                    key={`divider-${index}`}
                    className={`text-lg font-bold text-text-main mt-4 mb-2 border-t border-b border-surface-light pt-2 ${dividerClass}`}
                  >
                    {prop.label}
                  </h4>
                );
              }

              // --- 2. Lógica de Filas ---
              const rawValue = getNestedValue(item, prop.key);

              // Omitir si es condicional y el valor es nulo/vacío
              if (
                prop.conditional &&
                (rawValue === undefined || rawValue === null || rawValue === "")
              ) {
                return null;
              }

              // ... (Lógica de formateo: displayValue, se mantiene igual)
              let displayValue;
              if (typeof prop.format === "function") {
                displayValue = prop.format(rawValue, item);
              } else if (prop.format === "date" && formatDate) {
                displayValue = formatDate(rawValue) || "N/A";
              } else {
                if (
                  rawValue === undefined ||
                  rawValue === null ||
                  rawValue === ""
                ) {
                  displayValue = "N/A";
                } else {
                  displayValue = String(rawValue);
                }
              }

              // 4. Renderizar la fila
              if (displayValue === null || displayValue === undefined)
                return null;

              // Si es layout de 3 columnas, los elementos multilínea ocupan el ancho completo.
              const itemClass =
                idTwoColumns && prop.multiline ? "col-span-full" : "col-span-1";

              return (
                <div
                  // Solo aplicamos la clase de grid si estamos en modo 3 columnas
                  className={idTwoColumns ? itemClass : ""}
                  key={prop.key}
                >
                  <DetailRow
                    label={prop.label}
                    value={displayValue}
                    multiline={prop.multiline}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* --- Fin Contenido Dinámico --- */}

        {/* --- Botón de Cierre --- */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 font-semibold rounded-md shadow-md transition-colors ${buttonClass}`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
