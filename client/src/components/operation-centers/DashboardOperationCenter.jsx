/**
 * @file DashboardOperationCenter.jsx
 * @module Components/OperationCenters
 * @description Página principal para la gestión de Centros de Operación.
 * Permite a los administradores visualizar, buscar, filtrar y gestionar el estado de todos los centros.
 * Incluye funcionalidades para cambiar entre vistas de tabla y tarjetas, y modales para
 * ver detalles y cambiar el estado (activar/desactivar).
 */
import React, { useEffect, useState } from "react";
import { useDashboardOperationCenter } from "../../hooks/operation-centers/useDashboardOperationCenter.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faToggleOn,
  faToggleOff,
  faTimes,
  faIdCard,
  faPhone,
  faBuilding,
  faUserShield,
  faExclamationTriangle,
  faTable,
  faThLarge,
  faMapMarkerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import CreateOperationCenterForm from "./CreateOperationCenterForm.jsx";
import { toast } from "react-hot-toast";

// --- SUBCOMPONENTES ---

/**
 * @function CenterDetailModal
 * @description Modal que muestra información detallada de un Centro de Operación.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element|null}
 */
const CenterDetailModal = ({ center, onClose }) => {
  if (!center) return null;
  const DetailRow = ({ label, value, icon }) => (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <p className="text-sm text-neutral-taupe font-semibold flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className="w-4 text-primary/70" />
        {label}
      </p>
      <p className="text-md text-text-main pl-6">{value || "N/A"}</p>
    </div>
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg shadow-xl w-full max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-bold text-primary">
            Detalles del Centro
          </h3>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <DetailRow label="Código" value={center.codigo} icon={faIdCard} />
          <DetailRow
            label="Dirección"
            value={center.direccion}
            icon={faMapMarkerAlt}
          />
          <DetailRow label="Correo" value={center.correo} icon={faEnvelope} />
          <DetailRow label="Teléfono" value={center.telefono} icon={faPhone} />
          <DetailRow
            label="Ciudad"
            value={center.City?.nombre_ciudad}
            icon={faBuilding}
          />
          <DetailRow
            label="Creado por (Admin)"
            value={center.AdminCreador?.nombre}
            icon={faUserShield}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * @function ConfirmStatusChangeModal
 * @description Modal de confirmación para activar o desactivar un Centro de Operación.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const ConfirmStatusChangeModal = ({
  center,
  onConfirm,
  onCancel,
  isSubmitting,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="bg-secondary rounded-lg shadow-xl p-6 w-full max-w-md text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning/10 mb-4">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="h-6 w-6 text-warning"
        />
      </div>
      <h3 className="text-xl font-bold text-text-main mb-2">
        Confirmar Cambio de Estado
      </h3>
      <p className="text-text-main mb-6">
        Estás a punto de {center.activo ? "desactivar" : "activar"} el centro de
        operación con código{" "}
        <strong className="font-semibold">{center.codigo}</strong>.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`py-2 px-4 rounded-lg text-white font-bold hover:opacity-90 ${
            center.activo ? "bg-accent" : "bg-success"
          }`}
        >
          {isSubmitting
            ? "Procesando..."
            : `Sí, ${center.activo ? "Desactivar" : "Activar"}`}
        </button>
      </div>
    </div>
  </div>
);

/**
 * @function CenterTable
 * @description Renderiza una tabla con la lista de Centros de Operación.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const CenterTable = ({ centers, onAction }) => (
  <div className="overflow-auto bg-secondary rounded-lg max-h-[500px] shadow-md">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 whitespace-nowrap font-semibold">Código</th>
          <th className="p-4 whitespace-nowrap font-semibold hidden sm:table-cell">
            Dirección
          </th>
          <th className="p-4 whitespace-nowrap font-semibold hidden sm:table-cell">
            Telefono
          </th>
          <th className="p-4 whitespace-nowrap font-semibold">Ciudad</th>
          <th className="p-4 whitespace-nowrap font-semibold">Estado</th>
          <th className="p-4 whitespace-nowrap font-semibold text-center">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {centers.map((center) => (
          <tr
            key={center.id_centro_operacion}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 whitespace-nowrap font-bold">{center.codigo}</td>
            <td className="p-4 whitespace-nowrap hidden sm:table-cell">
              {center.direccion}
            </td>
            <td className="p-4 whitespace-nowrap hidden sm:table-cell">
              {center.telefono}
            </td>
            <td className="p-4 whitespace-nowrap">
              {center.City?.nombre_ciudad || "N/A"}
            </td>
            <td className="p-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  center.activo
                    ? "bg-success/20 text-success"
                    : "bg-error/20 text-error"
                }`}
              >
                {center.activo ? "Activo" : "Inactivo"}
              </span>
            </td>
            <td className="p-4 whitespace-nowrap text-center space-x-4">
              <button
                onClick={() => onAction("details", center)}
                className="text-primary hover:opacity-70"
                title="Ver Detalles"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() => onAction("status", center)}
                className="text-accent hover:opacity-70"
                title="Cambiar Estado"
              >
                <FontAwesomeIcon
                  icon={center.activo ? faToggleOn : faToggleOff}
                  className={center.activo ? "text-success" : "text-gray-400"}
                />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * @function CenterCards
 * @description Renderiza una cuadrícula de tarjetas con la lista de Centros de Operación.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const CenterCards = ({ centers, onAction }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {centers.map((center) => (
      <div
        key={center.id_centro_operacion}
        className="bg-secondary rounded-lg shadow p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-lg text-text-main">
              Centro Cód: {center.codigo}
            </p>
            <span
              className={`px-2 py-1 text-xs font-bold rounded-full ${
                center.activo
                  ? "bg-success/20 text-success"
                  : "bg-error/20 text-error"
              }`}
            >
              {center.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
          <p className="text-sm text-neutral-taupe">{center.direccion}</p>
          <p className="text-sm text-neutral-taupe">
            {center.City?.nombre_ciudad}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => onAction("details", center)}
            className="text-primary hover:opacity-70"
            title="Ver Detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onAction("status", center)}
            className="text-accent hover:opacity-70"
            title="Cambiar Estado"
          >
            <FontAwesomeIcon
              icon={center.activo ? faToggleOn : faToggleOff}
              className={center.activo ? "text-success" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    ))}
  </div>
);

/**
 * @function DashboardSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del Dashboard de Centros de Operación.
 * @returns {JSX.Element}
 */
const DashboardSkeleton = () => (
  <div className="w-full animate-pulse">
    {/* Esqueleto de la Cabecera */}
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="h-10 bg-gray-200 rounded w-2/5"></div>
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-200 rounded w-36"></div>
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </header>

    {/* Esqueleto de los Filtros */}
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="h-10 bg-gray-200 rounded w-full md:w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded w-full md:w-48"></div>
    </div>

    {/* Esqueleto de la Tabla */}
    <div className="bg-secondary rounded-lg shadow-md p-4">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center gap-4 p-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 hidden sm:block"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 hidden md:block"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * @function DashboardOperationCenter
 * @description Componente principal de la página de gestión de Centros de Operación.
 * @returns {JSX.Element}
 */
export default function DashboardOperationCenter() {
  const { centers, isLoading, error, refetch, setSearchTerm, setSortBy } =
    useDashboardOperationCenter();
  const [viewMode, setViewMode] = useState("table");
  const [modal, setModal] = useState({ type: null, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (type, center = null) =>
    setModal({ type, data: center });

  const closeModal = () => setModal({ type: null, data: null });

  /**
   * @function handleSuccess
   * @description Callback de éxito para la creación de centros. Muestra un toast y recarga los datos.
   * @param {string} message - Mensaje de éxito.
   */
  const handleSuccess = (message) => {
    toast.success(message);
    refetch();
    closeModal();
  };

  /**
   * @async
   * @function handleStatusChange
   * @description Maneja la lógica para cambiar el estado de un centro usando toast.promise.
   */
  const handleStatusChange = async () => {
    if (modal.type !== "status") return;

    const center = modal.data;
    const newState = !center.activo;
    const actionText = newState ? "reactivado" : "desactivado";

    setIsSubmitting(true);

    await toast.promise(
      api.patch(`/api/centros-operacion/${center.id_centro_operacion}/estado`, {
        activo: newState,
      }),
      {
        loading: `Cambiando estado del centro ${center.codigo}...`,
        success: `¡Centro ${actionText} exitosamente!`,
        error: (err) =>
          err.response?.data?.message || `Error al cambiar el estado.`,
      }
    );

    closeModal();
    refetch();
    setIsSubmitting(false);
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error)
    return <div className="text-center w-full p-10 text-error">{error}</div>;

  return (
    <div className="w-full mb-10">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold text-text-main">
          Gestión de Centros de Operación
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAction("createCenter")}
            className="bg-primary text-text-light font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Centro</span>
          </button>
          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${
                viewMode === "table" ? "bg-primary text-white" : "text-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={faTable} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md ${
                viewMode === "card" ? "bg-primary text-white" : "text-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por código, dirección o correo..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg"
        />
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded-lg"
        >
          <option value="codigo_asc">Código (Asc)</option>
          <option value="codigo_desc">Código (Desc)</option>
        </select>
      </div>

      {centers.length === 0 ? (
        <div className="text-center w-full p-10">
          No hay centros que coincidan.
        </div>
      ) : viewMode === "table" ? (
        <CenterTable centers={centers} onAction={handleAction} />
      ) : (
        <CenterCards centers={centers} onAction={handleAction} />
      )}

      {/* RENDERIZADO DE MODALES */}
      {modal.type === "createCenter" && (
        <CreateOperationCenterForm
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {modal.type === "details" && (
        <CenterDetailModal center={modal.data} onClose={closeModal} />
      )}
      {modal.type === "status" && (
        <ConfirmStatusChangeModal
          center={modal.data}
          onCancel={closeModal}
          onConfirm={handleStatusChange}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
