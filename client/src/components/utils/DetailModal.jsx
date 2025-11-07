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
  if (!obj || !path) return "N/A";
  // Divide el path por '.' y recorre el objeto
  const value = path.split(".").reduce((acc, part) => {
    // Si acc (acumulador) es nulo o undefined, retorna nulo para evitar errores
    if (acc === null || acc === undefined) {
      return null;
    }
    return acc[part];
  }, obj);

  return value !== null && value !== undefined ? value : "N/A";
};

/**
 * @function DetailRow
 * @description Subcomponente para renderizar una fila de label/valor.
 * @param {object} props
 * @param {string} props.label - Etiqueta para la fila.
 * @param {string|number} props.value - Valor a mostrar.
 * @returns {JSX.Element}
 */
const DetailRow = ({ label, value }) => (
  <p className="text-base text-text-main">
    <strong className="font-semibold text-text-main/70">{label}:</strong>{" "}
    {value}
  </p>
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
}) {
  if (!item) return null;

  // Clases dinámicas para el tema
  const titleColor = `text-${themeColor}`; // ej. text-primary
  const buttonClass = `bg-${themeColor} text-surface hover:bg-${themeColor}-hover`; // ej. bg-primary...

  return (
    <div className="fixed inset-0 bg-text-main/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        className="relative bg-background p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 animate-fadeIn"
        // Usa un ID del item si existe, o un string aleatorio como key
        key={item.id_visita || item.id_paquete || item.id_vehiculo || "modal"}
      >
        <h3
          className={`text-2xl font-bold ${titleColor} mb-6 text-center border-b pb-2`}
        >
          {title}
        </h3>

        {/* --- Contenido Dinámico del Modal --- */}
        <div className="space-y-4 text-text-main">
          {config.map((prop) => {
            // 1. Obtener el valor (simple o anidado)
            const value = getNestedValue(item, prop.key);

            // 2. Omitir si es condicional y el valor no existe
            if (prop.conditional && (value === "N/A" || !value)) {
              return null;
            }

            // 3. Formatear el valor si es necesario
            let displayValue = value;
            if (prop.format === "date" && formatDate) {
              displayValue = formatDate(value) || "Pendiente";
            } else if (value === "N/A" || !value) {
              displayValue = "N/A"; // Valor por defecto si es nulo o undefined
            }

            // 4. Renderizar la fila
            return (
              <DetailRow
                key={prop.key}
                label={prop.label}
                value={displayValue}
              />
            );
          })}
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
