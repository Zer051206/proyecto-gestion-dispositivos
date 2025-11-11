/**
 * @file ActionactionButtons.jsx
 * @description Componente para renderizar el botón de acción condicional en la tabla de requerimientos.
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faMoneyBillWave,
  faTruckMoving,
  faTools,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @function ActionButtons
 * @description Renderiza el botón de la siguiente acción según el estado del requerimiento y el rol del usuario.
 * @param {object} props
 * @param {object} props.req - Objeto del requerimiento.
 * @param {Function} props.onAction - Handler para abrir el modal de acción.
 * @returns {JSX.Element | null}
 */
export default function ActionButtons({ req, onAction }) {
  const { user } = useAuthStore();

  const status = req.Status?.nombre_estado;
  const userRole = user?.rol;
  let actionButton = null;

  // --- Lógica de Renderizado Condicional de Botones ---

  if (userRole === "Admin") {
    switch (status) {
      case "PENDIENTE_TI_ANALISIS":
        // Solo Admin/TI puede firmar el análisis
        actionButton = {
          title: "Firmar Análisis TI",
          icon: faFileSignature,
          actionType: "signTIAnalysis",
          color: "text-accent",
        };
        break;
      case "PENDIENTE_RH_PAGO":
        // Solo Admin/RH puede aprobar el pago
        actionButton = {
          title: "Aprobar Pago RH",
          icon: faMoneyBillWave,
          actionType: "signRHPago",
          color: "text-success",
        };
        break;
      case "PENDIENTE_TI_ALISTAMIENTO":
        // Solo Admin/TI gestiona el alistamiento/vinculación
        actionButton = {
          title: "Gestionar Alistamiento",
          icon: faTools,
          actionType: "openAlistamientoModal",
          color: "text-warning",
        };
        break;
      case "PENDIENTE_RH_ENTREGA":
        // Solo Admin/RH gestiona la entrega final
        actionButton = {
          title: "Firmar Entrega Final",
          icon: faTruckMoving,
          actionType: "signRHEntrega",
          color: "text-success",
        };
        break;
      default:
        // Si el estado no requiere acción (Ej: Entregado, Cancelado, Rechazado)
        return null;
    }
  } else if (userRole === "Encargado") {
    return null;
  } else {
    return null;
  }

  const isFinalState =
    status === "ENTREGADO" ||
    status === "CANCELADO" ||
    status === "RECHAZADO_TI" ||
    status === "RECHAZADO_RH";

  const canShowRejectButton = (() => {
    // 1. Si está en un estado final (Entregado, Cancelado, Rechazado), NO se muestra.
    if (isFinalState) return false;

    // 2. Lógica para el Encargado: Solo en el estado inicial PENDIENTE_TI_ANALISIS
    if (userRole === "Encargado") {
      return status === "PENDIENTE_TI_ANALISIS";
    }

    // 3. Lógica para el Administrador: En cualquier estado no final
    if (userRole === "Admin") {
      return true;
    }

    return false;
  })();

  // Renderiza el botón si se definió
  return (
    <div className="flex space-x-2">
      {canShowRejectButton && (
        <button
          // determinan si es CANCELADO o RECHAZADO_X basándose en el rol/estado.
          onClick={() => onAction("reject", req)}
          className="text-error hover:opacity-70 transition-colors"
          // Adaptar el title según el rol para mejorar la UX
          title={
            userRole === "Encargado"
              ? "Cancelar Requerimiento"
              : "Rechazar/Cancelar Requerimiento"
          }
        >
          <FontAwesomeIcon icon={faBan} />
        </button>
      )}
      {/* Botón de Avance de Estado */}
      {actionButton && (
        <button
          onClick={() => onAction(actionButton.actionType, req)}
          className={`${actionButton.color} hover:opacity-70 transition-colors`}
          title={actionButton.title}
        >
          <FontAwesomeIcon icon={actionButton.icon} />
        </button>
      )}
    </div>
  );
}
