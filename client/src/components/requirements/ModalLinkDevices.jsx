/**
 * @file ModalLinkDevices.jsx
 * @module Components/Requerimientos
 * @description Modal orquestador para el proceso de Alistamiento (PENDIENTE_TI_ALISTAMIENTO).
 * Muestra dinámicamente formularios de creación de Equipos y/o Periféricos en pestañas,
 * basado en lo aprobado en el Análisis Técnico del requerimiento.
 * Solo permite avanzar el estado del requerimiento cuando todos los activos necesarios han sido creados.
 * @requires CreateDeviceForm
 * @requires CreatePeripheralForm
 * @requires @fortawesome/react-fontawesome
 */
import React, { useState } from "react";
import CreateDeviceForm from "../devices/CreateDevicesForm.jsx";
import CreatePeripheralForm from "../devices/CreatePeripheralsForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faLaptop,
  faMouse,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

// Constantes para identificar las pestañas
const TAB_EQUIPOS = "equipos";
const TAB_PERIFERICOS = "perifericos";

/**
 * @function ModalLinkDevices
 * @description Modal principal para gestionar la creación y vinculación de activos (Equipos/Periféricos)
 * a un requerimiento específico.
 * @param {object} props
 * @param {object} props.req - Objeto del requerimiento completo, incluyendo 'TechnicalAnalysis'.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onFinishAlistamiento - Callback para notificar que el estado del requerimiento debe avanzar.
 * @returns {JSX.Element}
 */
export default function ModalLinkDevices({
  req,
  onClose,
  onFinishAlistamiento,
}) {
  const codReq = req.codigo_requerimiento;
  const idRequerimiento = req.id_requerimiento;

  const analisis = req.TechnicalAnalysis || {};
  const equiposNecesarios = analisis.cantidad_equipos > 0;
  const perifericosNecesarios = analisis.cantidad_perifericos > 0;

  const totalTareas =
    (equiposNecesarios ? 1 : 0) + (perifericosNecesarios ? 1 : 0);

  // Inicia en TRUE si el activo NO es necesario, satisfaciendo esa parte de la condición final.
  const [equiposCreados, setEquiposCreados] = useState(!equiposNecesarios);
  const [perifericosCreados, setPerifericosCreados] = useState(
    !perifericosNecesarios
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Establece la pestaña inicial a la primera requerida
  const [activeTab, setActiveTab] = useState(
    equiposNecesarios
      ? TAB_EQUIPOS
      : perifericosNecesarios
      ? TAB_PERIFERICOS
      : null
  );

  // Se completa si ambos estados son TRUE (incluyendo los que iniciaron TRUE)
  const isAlistamientoComplete = equiposCreados && perifericosCreados;

  /**
   * @function handleSuccess
   * @description Maneja el éxito de la creación de un formulario individual.
   * @param {string} type - 'device' o 'peripheral'.
   * @param {string} message - Mensaje de éxito del formulario.
   */
  const handleSuccess = (type, message) => {
    toast.success(message);

    if (type === "device") {
      if (perifericosNecesarios && !perifericosCreados) {
        setActiveTab(TAB_PERIFERICOS);
      }
    }
  };

  /**
   * @async
   * @function handleComplete
   * @description Ejecuta el cambio de estado del requerimiento a 'PENDIENTE_RH_ENTREGA'.
   */
  const handleComplete = async () => {
    if (!isAlistamientoComplete) return;

    setIsSubmitting(true);
    try {
      // Llama al endpoint de la API para avanzar el estado
      await api.put(`/api/requerimientos/${idRequerimiento}/ti-alistamiento`, {
        actionType: "manageTIAsset",
      });

      onFinishAlistamiento(
        `Alistamiento de ${codReq} completado y estado avanzado.`
      );
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al finalizar el alistamiento.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases comunes para el diseño
  const tabItemClasses =
    "py-2 px-4 text-center cursor-pointer font-semibold transition-colors duration-200 border-b-2";
  const tabIconClasses = "mr-2 text-lg";

  // Muestra un mensaje si no se requiere ninguna acción
  if (totalTareas === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-4">
          Alistamiento Completo
        </h2>
        <p className="text-gray-700 mb-6">
          El análisis técnico no requirió el registro de nuevos equipos ni
          periféricos. Puede avanzar el requerimiento directamente.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
          >
            Cerrar
          </button>
          <button
            onClick={handleComplete}
            className="py-2 px-4 rounded-lg bg-success text-white font-bold hover:bg-success/90"
          >
            Avanzar Requerimiento{" "}
            <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-primary mb-2 flex items-center">
        <FontAwesomeIcon icon={faTools} className="mr-3" />
        Alistamiento de Activos para {codReq}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Complete el registro de los activos aprobados en el análisis técnico
        para avanzar el requerimiento. Tareas pendientes:{" "}
        <span className="font-bold text-warning">
          {(equiposNecesarios && !equiposCreados ? 1 : 0) +
            (perifericosNecesarios && !perifericosCreados ? 1 : 0)}{" "}
          de {totalTareas}
        </span>
        .
      </p>

      {/* --- NAVEGACIÓN DE PESTAÑAS (TABS) --- */}
      <nav className="flex border-b border-gray-300 mb-6">
        {equiposNecesarios && (
          <button
            className={`${tabItemClasses} ${
              activeTab === TAB_EQUIPOS
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary/70"
            }`}
            onClick={() => setActiveTab(TAB_EQUIPOS)}
          >
            <FontAwesomeIcon icon={faLaptop} className={tabIconClasses} />
            {equiposCreados ? "✅ Equipos (Completado)" : "1. Crear Equipos"}
          </button>
        )}

        {perifericosNecesarios && (
          <button
            className={`${tabItemClasses} ${
              activeTab === TAB_PERIFERICOS
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary/70"
            }`}
            onClick={() => setActiveTab(TAB_PERIFERICOS)}
          >
            <FontAwesomeIcon icon={faMouse} className={tabIconClasses} />
            {perifericosCreados
              ? "✅ Periféricos (Completado)"
              : "2. Crear Periféricos"}
          </button>
        )}
      </nav>

      {/* --- CONTENIDO DE LA PESTAÑA ACTIVA --- */}
      <div className="min-h-[400px]">
        {activeTab === TAB_EQUIPOS && equiposNecesarios && (
          <div className="p-2">
            <CreateDeviceForm
              idRequerimiento={idRequerimiento}
              onSuccess={(msg) => handleSuccess("device", msg)}
              onClose={onClose}
            />
          </div>
        )}

        {activeTab === TAB_PERIFERICOS && perifericosNecesarios && (
          <div className="p-2">
            <CreatePeripheralForm
              idRequerimiento={idRequerimiento}
              onSuccess={(msg) => handleSuccess("peripheral", msg)}
              onClose={onClose}
            />
          </div>
        )}
      </div>

      <footer className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
        >
          Cancelar
        </button>
        <button
          onClick={handleComplete}
          disabled={!isAlistamientoComplete || isSubmitting}
          className="py-2 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Avanzando Estado..."
            : "Finalizar y Avanzar Requerimiento"}
        </button>
      </footer>
    </div>
  );
}
