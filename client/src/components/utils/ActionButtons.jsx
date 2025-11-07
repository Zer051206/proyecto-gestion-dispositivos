/**
 * @file ActionButtons.jsx
 * @description Componente para renderizar el botón de acción condicional en la tabla de requerimientos.
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faMoneyBillWave,
  faTruckMoving,
  faTools,
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
  let button = null;

  // --- Lógica de Renderizado Condicional de Botones ---

  if (userRole === "Admin") {
    switch (status) {
      case "PENDIENTE_TI_ANALISIS":
        // Solo Admin/TI puede firmar el análisis
        button = {
          title: "Firmar Análisis TI",
          icon: faFileSignature,
          actionType: "signTIAnalysis",
          color: "text-accent",
        };
        break;
      case "PENDIENTE_RH_PAGO":
        // Solo Admin/RH puede aprobar el pago
        button = {
          title: "Aprobar Pago RH",
          icon: faMoneyBillWave,
          actionType: "signRHPago",
          color: "text-success",
        };
        break;
      case "PENDIENTE_TI_ALISTAMIENTO":
        // Solo Admin/TI gestiona el alistamiento/vinculación
        button = {
          title: "Gestionar Alistamiento",
          icon: faTools,
          actionType: "manageTIAsset",
          color: "text-warning",
        };
        break;
      case "PENDIENTE_RH_ENTREGA":
        // Solo Admin/RH gestiona la entrega final
        button = {
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
    // Los encargados solo pueden ver detalles y editar el requerimiento si está en análisis.
    if (status === "PENDIENTE_TI_ANALISIS") {
      button = {
        title: "Editar Requerimiento Inicial",
        icon: faTools,
        actionType: "editRequirement",
        color: "text-neutral-taupe",
      };
    } else {
      return null;
    }
  } else {
    return null;
  }

  // Renderiza el botón si se definió
  return (
    <button
      onClick={() => onAction(button.actionType, req)}
      className={`${button.color} hover:opacity-70 transition-colors`}
      title={button.title}
    >
      <FontAwesomeIcon icon={button.icon} />
    </button>
  );
}
