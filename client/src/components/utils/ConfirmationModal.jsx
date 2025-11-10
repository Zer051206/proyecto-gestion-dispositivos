/**
 * @file ConfirmationModal.jsx
 * @description Modal reutilizable para confirmar acciones (cambio de estado, rechazo/cancelación).
 * Soporta la adición de un campo de texto para ingresar una razón (ej. en rechazo/cancelación).
 */
import React, { useState } from "react";

/**
 * @function ConfirmationModal
 * @description Modal de confirmación genérico.
 * @param {object} props
 * @param {string} props.title - Título del modal (ej: "Confirmar Pago", "Rechazar Análisis").
 * @param {string} props.message - Mensaje de confirmación detallado.
 * @param {Function} props.onConfirm - Handler a ejecutar al confirmar. Recibe la razón si existe.
 * @param {Function} props.onClose - Handler para cerrar el modal.
 * @param {boolean} [props.requiresReason=false] - Si requiere un campo de texto para la razón.
 * @param {string} [props.confirmText="Confirmar"] - Texto del botón de confirmación.
 * @param {string} [props.confirmColor="bg-success"] - Clase de color para el botón de confirmación.
 * @returns {JSX.Element}
 */
export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onClose,
  requiresReason = false,
  confirmText = "Confirmar",
  confirmColor = "bg-success",
}) {
  const [reason, setReason] = useState("");

  // Deshabilita la confirmación si se requiere razón y el campo está vacío
  const isConfirmDisabled = requiresReason && reason.trim() === "";

  const handleConfirm = () => {
    // Pasa la razón solo si es requerida, si no, pasa undefined
    const reasonToSend = requiresReason ? reason.trim() : undefined;
    onConfirm(reasonToSend);
  };

  return (
    <div className="fixed inset-0 bg-text-main/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        className={`relative bg-background p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 animate-fadeIn`}
      >
        {/* Título */}
        <h3
          className={`text-xl font-bold ${confirmColor.replace(
            "bg-",
            "text-"
          )} mb-4 border-b pb-2`}
        >
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-text-main mb-6">{message}</p>

        {/* Campo de Razón (Condicional) */}
        {requiresReason && (
          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Razón de {title.split(" ")[0].toLowerCase()}{" "}
              <span className="text-error">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              className="w-full p-2 border border-surface-light rounded-md bg-surface-base text-text-main focus:ring-accent focus:border-accent"
              placeholder="Ingrese la razón de esta acción aquí..."
            ></textarea>
            {isConfirmDisabled && (
              <p className="text-error text-xs mt-1">
                Este campo es obligatorio.
              </p>
            )}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold rounded-md shadow-md transition-colors bg-surface-light text-text-main hover:bg-surface-dark"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 font-semibold rounded-md shadow-md transition-colors ${confirmColor} text-surface 
            ${
              isConfirmDisabled
                ? "opacity-50 cursor-not-allowed"
                : `hover:opacity-80`
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
