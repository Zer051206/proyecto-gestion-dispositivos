/**
 * @file ModalLinkDevices.jsx
 * @module Components/Requerimientos
 * @description Modal orquestador para el proceso de Alistamiento (PENDIENTE_TI_ALISTAMIENTO).
 * Componente de presentación que usa el hook useModalLinkDevices para la lógica de estado.
 * @requires CreateDeviceForm
 * @requires CreatePeripheralForm
 * @requires @fortawesome/react-fontawesome
 * @requires useModalLinkDevices
 */
import React from "react"; // No necesitamos useState, solo React
import CreateDeviceForm from "../devices/CreateDevicesForm.jsx";
import CreatePeripheralForm from "../devices/CreatePeripheralsForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faLaptop,
  faMouse,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useModalLinkDevices } from "../../hooks/requirements/useModalLinkDevices.js";

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

  const {
    TAB_EQUIPOS,
    TAB_PERIFERICOS,
    equiposNecesarios,
    perifericosNecesarios,
    totalTareas,
    tareasPendientes,
    activeTab,
    isLoading,
    isSubmitting,
    equiposCompletados,
    perifericosCompletados,
    isAlistamientoComplete,
    equiposFaltantes,
    perifericosFaltantes,
    handleSetActiveTab,
    handleSuccess,
    handleComplete,
  } = useModalLinkDevices(req);

  const tabItemClasses =
    "py-2 px-4 text-center cursor-pointer font-semibold transition-colors duration-200 border-b-2";
  const tabIconClasses = "mr-2 text-lg";

  // --- Renderizado Condicional: Carga ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12">
        {" "}
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg text-center">
          {" "}
          <h2 className="text-xl font-bold text-primary mb-4">
            Cargando Estado...
          </h2>{" "}
          <p className="text-gray-700 mb-6">
            Verificando activos vinculados, por favor espere.
          </p>{" "}
        </div>{" "}
      </div>
    );
  }

  // --- Renderizado Condicional: No Tareas Necesarias ---
  if (totalTareas === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12">
        {" "}
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
          {" "}
          <h2 className="text-xl font-bold text-primary mb-4">
            Alistamiento Completo{" "}
          </h2>{" "}
          <p className="text-gray-700 mb-6">
            El análisis técnico no requirió el registro de nuevos equipos ni
            periféricos. Puede avanzar el requerimiento directamente.{" "}
          </p>{" "}
          <div className="flex justify-end gap-3">
            {" "}
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
            >
              Cerrar{" "}
            </button>{" "}
            <button
              onClick={() => handleComplete(onFinishAlistamiento, onClose)} // 🛑 Usar función del hook
              disabled={isSubmitting}
              className="py-2 px-4 rounded-lg bg-success text-white font-bold hover:bg-success/90"
            >
              Avanzar Requerimiento{" "}
              <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }

  // --- Renderizado Principal ---
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      {" "}
      <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-4xl">
        {" "}
        <header className="justify-between items-center border-b border-gray-200 w-full bg-secondary z-10">
          {" "}
          <div className="flex justify-between items-center w-full">
            {" "}
            <h2 className="text-xl md:text-2xl font-bold text-primary flex ml-[60px] md:ml-0 items-center justify-between">
              <FontAwesomeIcon icon={faTools} className="mr-3" />
              Alistamiento de Activos para {codReq}{" "}
            </h2>{" "}
            <button
              onClick={onClose}
              className="text-text-main hover:opacity-70 ml-[70px] md:ml-0 mb-[150px] md:mb-[50px]"
            >
              <FontAwesomeIcon icon={faTimes} size="md:lg sm" />{" "}
            </button>{" "}
          </div>{" "}
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            Complete el registro de los activos aprobados en el análisis técnico
            para avanzar el requerimiento. Tareas pendientes:{" "}
            <span className="font-bold text-warning">
              {tareasPendientes} de {totalTareas}{" "}
            </span>{" "}
          </p>{" "}
        </header>
        {/* --- NAVEGACIÓN DE PESTAÑAS (TABS) --- */}{" "}
        <nav className="flex border-b border-gray-300 mb-6">
          {" "}
          {equiposNecesarios && (
            <button
              disabled={equiposCompletados}
              className={`${tabItemClasses} ${
                activeTab === TAB_EQUIPOS
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary/70"
              } ${
                equiposCompletados
                  ? "bg-success/10 text-success cursor-default"
                  : ""
              }`}
              onClick={() => handleSetActiveTab(TAB_EQUIPOS)}
            >
              {" "}
              <FontAwesomeIcon
                icon={faLaptop}
                className={tabIconClasses}
              />{" "}
              {equiposCompletados
                ? "✅ Equipos (Completado)"
                : `1. Crear Equipos (${equiposFaltantes} faltante(s))`}{" "}
            </button>
          )}{" "}
          {perifericosNecesarios && (
            <button
              // 🛑 Deshabilitar si está completo
              disabled={perifericosCompletados}
              className={`${tabItemClasses} ${
                activeTab === TAB_PERIFERICOS
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary/70"
              } ${
                perifericosCompletados
                  ? "bg-success/10 text-success cursor-default"
                  : ""
              }`}
              onClick={() => handleSetActiveTab(TAB_PERIFERICOS)} // 🛑 Usar función del hook
            >
              {" "}
              <FontAwesomeIcon icon={faMouse} className={tabIconClasses} />{" "}
              {perifericosCompletados
                ? "✅ Periféricos (Completado)"
                : `2. Crear Periféricos (${perifericosFaltantes} faltante(s))`}{" "}
            </button>
          )}{" "}
        </nav>
        {/* --- CONTENIDO DE LA PESTAÑA ACTIVA --- */}{" "}
        <div className="min-h-[200px]">
          {/* Solo renderiza si es la pestaña activa Y NO está completado */}{" "}
          {activeTab === TAB_EQUIPOS &&
            equiposNecesarios &&
            !equiposCompletados && (
              <div className="p-2">
                {" "}
                <CreateDeviceForm
                  idRequerimiento={req.id_requerimiento} // Usar el ID del requerimiento original
                  onSuccess={(msg) => handleSuccess("device", msg)} // 🛑 Usar función del hook
                  onClose={onClose}
                  isNestedForm={true}
                  requiredCount={equiposFaltantes} // 🛑 Pasar la cantidad faltante al formulario
                />{" "}
              </div>
            )}
          {/* Solo renderiza si es la pestaña activa Y NO está completado */}{" "}
          {activeTab === TAB_PERIFERICOS &&
            perifericosNecesarios &&
            !perifericosCompletados && (
              <div className="p-2">
                {" "}
                <CreatePeripheralForm
                  idRequerimiento={req.id_requerimiento} // Usar el ID del requerimiento original
                  onSuccess={(msg) => handleSuccess("peripheral", msg)} // 🛑 Usar función del hook
                  onClose={onClose}
                  isNestedForm={true}
                  requiredCount={perifericosFaltantes} // 🛑 Pasar la cantidad faltante al formulario
                />{" "}
              </div>
            )}
          {/* Mensaje de completado si no hay pestaña activa y el alistamiento está completo */}
          {isAlistamientoComplete && (
            <div className="text-center p-10 bg-success/5 rounded-lg border border-success/20">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                className="text-success mb-4"
              />
              <p className="text-lg font-bold text-success">
                ¡Alistamiento Completo!
              </p>
              <p className="text-gray-600">
                Puede finalizar el proceso y avanzar el estado del
                requerimiento.
              </p>
            </div>
          )}{" "}
        </div>{" "}
        <footer className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
          {" "}
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
          >
            Cancelar{" "}
          </button>{" "}
          <button
            onClick={() => handleComplete(onFinishAlistamiento, onClose)} // 🛑 Usar función del hook
            disabled={!isAlistamientoComplete || isSubmitting} // 🛑 Control del hook
            className="py-2 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
          >
            {" "}
            {isSubmitting
              ? "Avanzando Estado..."
              : "Finalizar y Avanzar Requerimiento"}{" "}
          </button>{" "}
        </footer>{" "}
      </div>{" "}
    </div>
  );
}
