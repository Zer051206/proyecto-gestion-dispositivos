/**
 * @file DashboardRequirement.jsx
 * @module Components/Requirements
 * @description Página principal para la gestión de requerimientos. Permite a los usuarios
 * visualizar, buscar, filtrar y gestionar el estado de todos los requerimientos.
 * Incluye funcionalidad para iniciar la creación de un nuevo requerimiento.
 * @requires react
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/requirements/useDashboardRequirement.js
 * @requires ./CreateRequirementModal.jsx
 */
import React, { useState } from "react";
import { useDashboardRequirement } from "../../hooks/requirements/useDashboardRequirement.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import CreateRequirementForm from "./CreateRequirementForm.jsx";
import { useAuthStore } from "../../stores/authStore.js";
import ActionButtons from "../utils/ActionButtons.jsx";
import DetailModal from "../utils/DetailModal.jsx";
import { getRequerimientoDetailConfig } from "../../hooks/utils/detailConfig.js";
import { formatDate } from "../../utils/dateFormat.js";
import TechnicalAnalysisModal from "./TechnicalAnalysisModal.jsx";
import ConfirmationModal from "../utils/ConfirmationModal.jsx";
import ModalLinkDevices from "./ModalLinkDevices.jsx";

const RequirementTableSkeleton = () => {
  const numRows = 8;
  const skeletonRows = Array.from({ length: numRows }, (_, index) => (
    <tr key={index} className="border-t border-gray-200">
      {/* 1. CÓDIGO */}
      <td className="p-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </td>
      {/* 2. FECHA SOLICITUD */}
      <td className="p-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </td>
      {/* 3. ESTADO */}
      <td className="p-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </td>
      {/* 4. ASUNTO */}
      <td className="p-4 hidden sm:table-cell max-w-xs truncate">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </td>
      {/* 5. CENTRO OP. */}
      <td className="p-4 hidden md:table-cell">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      </td>
      {/* 6. ACCIONES */}
      <td className="p-4 whitespace-nowrap text-center space-x-4">
        <div className="flex justify-center space-x-2">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="overflow-auto bg-secondary rounded-lg shadow-md max-h-[70vh] animate-pulse">
      <table className="w-full text-left text-text-main">
        <thead className="bg-gray-100/80 sticky top-0">
          <tr>
            <th className="p-4 whitespace-nowrap font-semibold">Código</th>
            <th className="p-4 whitespace-nowrap font-semibold">
              Fecha Solicitud
            </th>
            <th className="p-4 whitespace-nowrap font-semibold">Estado</th>
            <th className="p-4 whitespace-nowrap font-semibold hidden sm:table-cell">
              Asunto
            </th>
            <th className="p-4 whitespace-nowrap font-semibold hidden md:table-cell">
              Centro Op.
            </th>
            <th className="p-4 whitespace-nowrap font-semibold text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>{skeletonRows}</tbody>
      </table>
    </div>
  );
};

/**
 * @function DashboardRequirementSkeleton
 * @description Renderiza el esqueleto completo de la página de requerimientos (encabezado, filtros y tabla).
 * @returns {JSX.Element}
 */
const DashboardRequirementSkeleton = () => (
  <div className="w-full mb-10 animate-pulse">
    {/* --- ESQUELETO DEL ENCABEZADO --- */}
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* Título */}
      <div className="h-10 bg-gray-200 rounded w-64"></div>
      {/* Botón Nuevo Requerimiento */}
      <div className="h-10 bg-gray-200 rounded w-48"></div>
    </header>

    {/* --- ESQUELETO DE FILTROS Y BÚSQUEDA --- */}
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Input de Búsqueda */}
      <div className="w-full md:flex-1 h-10 bg-gray-200 rounded-lg"></div>
      {/* Filtro por Estado */}
      <div className="w-full md:w-52 h-10 bg-gray-200 rounded-lg"></div>
      {/* Ordenamiento */}
      <div className="w-full md:w-auto h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* --- ESQUELETO DE LA TABLA --- */}
    <RequirementTableSkeleton />
  </div>
);

/**
 * @function RequirementTable
 * @description Componente que renderiza la tabla de Requerimientos con celdas explícitas.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.requirements - Lista de requerimientos filtrada y ordenada.
 * @param {Function} props.onAction - Función para manejar acciones (detalles/edición).
 * @param {Function} props.setSortBy - Setter del hook para cambiar la columna de ordenamiento.
 * @param {string} props.sortBy - Estado actual del ordenamiento.
 * @returns {JSX.Element}
 */
const RequirementTable = ({
  requirements,
  onAction,
  handleSortClick,
  sortBy,
}) => {
  const getStatusClass = (statusName) => {
    if (statusName === "En Análisis TI") return "bg-warning/20 text-warning";
    if (statusName === "Aprobado RR. HH.") return "bg-success/20 text-success";
    if (statusName === "Rechazado") return "bg-error/20 text-error";
    return "bg-gray-200/50 text-gray-700";
  };

  const getSortIndicator = (field) => {
    const [currentField, currentDirection] = sortBy.split("_");
    if (currentField !== field) return null;
    return currentDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="overflow-auto bg-secondary rounded-lg shadow-md max-h-[70vh] animate-fade-in">
      <table className="w-full text-left text-text-main">
        <thead className="bg-gray-100/80 sticky top-0">
          <tr>
            {/* CÓDIGO (Ordenable: campo 'codigo') */}
            <th
              className="p-4 whitespace-nowrap font-semibold cursor-pointer hover:bg-gray-200/80 transition-colors"
              onClick={() => handleSortClick("codigo")}
            >
              Código{" "}
              <span className="text-primary">{getSortIndicator("codigo")}</span>
            </th>

            {/* FECHA SOLICITUD (Ordenable: campo 'fecha') */}
            <th
              className="p-4 whitespace-nowrap font-semibold cursor-pointer hover:bg-gray-200/80 transition-colors"
              onClick={() => handleSortClick("fecha")}
            >
              Fecha Solicitud{" "}
              <span className="text-primary">{getSortIndicator("fecha")}</span>
            </th>

            {/* ESTADO (Ordenable: campo 'estado') */}
            <th
              className="p-4 whitespace-nowrap font-semibold cursor-pointer hover:bg-gray-200/80 transition-colors"
              onClick={() => handleSortClick("estado")}
            >
              Estado{" "}
              <span className="text-primary">{getSortIndicator("estado")}</span>
            </th>

            {/* ASUNTO (No ordenable) */}
            <th className="p-4 whitespace-nowrap font-semibold hidden sm:table-cell">
              Asunto
            </th>

            {/* CENTRO OP. (No ordenable) */}
            <th className="p-4 whitespace-nowrap font-semibold hidden md:table-cell">
              Centro Op.
            </th>

            {/* ACCIONES (Fija) */}
            <th className="p-4 whitespace-nowrap font-semibold text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {requirements.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-6 text-neutral-taupe">
                No se encontraron requerimientos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            requirements.map((req) => (
              <tr
                key={req.id_requerimiento}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {/* 1. CÓDIGO (req.codigo_requerimiento) */}
                <td className="p-4 whitespace-nowrap font-bold">
                  {req.codigo_requerimiento}
                </td>

                {/* 2. FECHA SOLICITUD (req.fecha_solicitud) */}
                <td className="p-4 whitespace-nowrap text-sm">
                  {formatDate(req.fecha_solicitud)}
                </td>

                {/* 3. ESTADO (req.Status.nombre_estado) */}
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(
                      req.Status?.nombre_estado
                    )}`}
                  >
                    {req.Status?.nombre_estado || "N/A"}
                  </span>
                </td>

                {/* 4. ASUNTO (req.asunto) */}
                <td
                  className="p-4 whitespace-nowrap hidden sm:table-cell max-w-xs truncate"
                  title={req.asunto}
                >
                  {req.asunto}
                </td>

                {/* 5. CENTRO OP. (req.CenterOfOperation.codigo) */}
                <td className="p-4 whitespace-nowrap hidden md:table-cell">
                  {req.CenterOfOperation?.codigo || "N/A"}
                </td>

                {/* ACCIONES */}
                <td className="p-4 whitespace-nowrap text-center space-x-4">
                  <button
                    onClick={() => onAction("details", req)}
                    className="text-primary hover:opacity-70"
                    title="Ver Detalles"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <ActionButtons req={req} onAction={onAction} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/**
 * @function ConfirmationModalWrapper
 * @description Componente que orquesta los props para el ConfirmationModal, mapeando el actionType a texto y colores.
 * @param {object} props
 * @param {object} props.modal - Estado del modal: {type, data: {req, actionType}}
 * @param {Function} props.closeModal - Handler para cerrar el modal.
 * @param {Function} props.executeRequirementAction - Función que ejecuta la llamada a la API.
 * @returns {JSX.Element | null}
 */
const ConfirmationModalWrapper = ({
  modal,
  closeModal,
  executeRequirementAction,
}) => {
  // Validamos que el modal esté abierto y sea de tipo 'confirmation'
  if (modal.type !== "confirmation" || !modal.data?.req) {
    return null;
  }

  const { req, actionType } = modal.data;
  const reqCode = req.codigo_requerimiento;
  let props = {
    title: "",
    message: "",
    confirmText: "Confirmar",
    confirmColor: "bg-success",
    requiresReason: false,
  };

  switch (actionType) {
    case "signRHPago":
      props.title = `Aprobar Pago RH para ${reqCode}`;
      props.message =
        "Esta acción confirma la aprobación de pago/gasto por Recursos Humanos y avanza el requerimiento a la fase de Alistamiento TI.";
      props.confirmText = "Aprobar Pago";
      props.confirmColor = "bg-success";
      break;

    case "signRHEntrega":
      props.title = `Firmar Entrega Final para ${reqCode}`;
      props.message =
        "Esta acción finaliza y Cierra el requerimiento. Confirme que la entrega administrativa por RR. HH. ha sido completada.";
      props.confirmText = "Cerrar Requerimiento";
      props.confirmColor = "bg-success";
      break;

    case "reject":
      props.title = `Rechazar/Cancelar Requerimiento ${reqCode}`;
      props.message =
        "Debe proporcionar una razón para cancelar este requerimiento. Esta acción lo marca como CANCELADO y no podrá ser revertida.";
      props.confirmText = "Cancelar Requerimiento";
      props.confirmColor = "bg-error";
      props.requiresReason = true;
      break;

    default:
      return null; // Si el actionType no es conocido
  }

  // Handler unificado para la confirmación
  const handleConfirm = async (reason) => {
    const success = await executeRequirementAction(actionType, req, reason);
    if (success) {
      closeModal();
    }
    // Si falla (success es false), el hook ya muestra el toast de error y no se cierra el modal.
  };

  return (
    <ConfirmationModal
      title={props.title}
      message={props.message}
      onConfirm={handleConfirm}
      onClose={closeModal}
      requiresReason={props.requiresReason}
      confirmText={props.confirmText}
      confirmColor={props.confirmColor}
    />
  );
};

/**
 * @function DashboardRequirement
 * @description Componente principal de la página de gestión de requerimientos.
 * Orquesta la obtención de datos, los filtros, la tabla y la gestión de modales.
 * @returns {JSX.Element}
 */
export default function DashboardRequirement() {
  // Consumir el hook para obtener datos, lógica, y handlers
  const {
    requirements,
    isLoading,
    error,
    setSearchTerm,
    setSortBy,
    setFilterStatus,
    handleAction,
    closeModal,
    handleSuccess,
    searchTerm,
    sortBy,
    filterStatus,
    availableStatuses,
    modal,
    handleSortClick,
    executeRequirementAction,
  } = useDashboardRequirement();

  const { user } = useAuthStore();

  if (isLoading) return <DashboardRequirementSkeleton />;

  if (error)
    return (
      <div className="text-center flex justify-center items-center w-full p-10 text-error font-semibold">
        {error}
      </div>
    );

  return (
    <div className="w-full mb-10">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold text-text-main">
          Gestión de Requerimientos
        </h1>
        <div className="flex items-center gap-4">
          {user?.rol === "Encargado" && (
            <button
              onClick={() => handleAction("createRequirement")}
              className="bg-primary text-text-light font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Nuevo Requerimiento</span>
            </button>
          )}
        </div>
      </header>

      {/* --- FILTROS Y BÚSQUEDA --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por código, asunto o centro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        />

        {/* Filtro por Estado */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-52 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="TODOS">Todos los Estados</option>
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Ordenamiento */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="fecha_desc">Fecha (Reciente)</option>
          <option value="fecha_asc">Fecha (Antigua)</option>
          <option value="codigo_asc">Código (Asc)</option>
          <option value="codigo_desc">Código (Desc)</option>
          <option value="estado_asc">Estado (A-Z)</option>
          <option value="estado_desc">Estado (Z-A)</option>
        </select>
      </div>

      {/* Renderizado de la tabla de Requerimientos */}
      <RequirementTable
        requirements={requirements}
        onAction={handleAction}
        setSortBy={setSortBy}
        sortBy={sortBy}
        handleSortClick={handleSortClick}
      />

      {modal.type === "openAlistamientoModal" && modal.data && (
        <ModalLinkDevices
          req={modal.data}
          onClose={closeModal}
          onFinishAlistamiento={handleSuccess}
        />
      )}

      {modal.type === "details" && modal.data && (
        <DetailModal
          title={`Detalles del Requerimiento ${modal.data.codigo_requerimiento}`}
          isOpen={true}
          onClose={closeModal}
          config={getRequerimientoDetailConfig(modal.data, formatDate)}
          item={modal.data}
          formatDate={formatDate}
          layoutType="two-column"
        />
      )}

      {modal.type === "createRequirement" && (
        <CreateRequirementForm onClose={closeModal} onSuccess={handleSuccess} />
      )}

      {modal.type === "signTIAnalysis" && modal.data && (
        <TechnicalAnalysisModal
          requerimiento={modal.data}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      <ConfirmationModalWrapper
        modal={modal}
        closeModal={closeModal}
        executeRequirementAction={executeRequirementAction}
      />
    </div>
  );
}
