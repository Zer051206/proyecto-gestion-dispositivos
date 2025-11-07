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
import {
  faPlus,
  faEye,
  faEdit,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import CreateRequirementForm from "./CreateRequirementForm.jsx";
import { useAuthStore } from "../../stores/authStore.js";
import ActionButtons from "../utils/ActionButtons.jsx";

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
                  {new Date(req.fecha_solicitud).toLocaleDateString()}
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
  } = useDashboardRequirement();

  const { user } = useAuthStore();

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

      {modal.type === "createRequirement" && (
        <CreateRequirementForm onClose={closeModal} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
