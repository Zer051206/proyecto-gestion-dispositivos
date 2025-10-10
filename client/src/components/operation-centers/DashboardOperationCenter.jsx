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

// --- SUBCOMPONENTES ---

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
            value={center.User?.nombre}
            icon={faUserShield}
          />
        </div>
      </div>
    </div>
  );
};

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

const CenterTable = ({ centers, onAction }) => (
  <div className="overflow-x-auto bg-secondary rounded-lg shadow-md">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 font-semibold">Código</th>
          <th className="p-4 font-semibold hidden sm:table-cell">Dirección</th>
          <th className="p-4 font-semibold hidden md:table-cell">Ciudad</th>
          <th className="p-4 font-semibold">Estado</th>
          <th className="p-4 font-semibold text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {centers.map((center) => (
          <tr
            key={center.id_centro_operacion}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 font-bold">{center.codigo}</td>
            <td className="p-4 hidden sm:table-cell">{center.direccion}</td>
            <td className="p-4 hidden md:table-cell">
              {center.City?.nombre_ciudad || "N/A"}
            </td>
            <td className="p-4">
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
            <td className="p-4 text-center space-x-4">
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

// --- COMPONENTE PRINCIPAL ---
export default function DashboardOperationCenter() {
  const { centers, isLoading, error, refetch, setSearchTerm, setSortBy } =
    useDashboardOperationCenter();
  const [viewMode, setViewMode] = useState("table");
  const [modal, setModal] = useState({ type: null, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (type, center = null) =>
    setModal({ type, data: center });
  const closeModal = () => setModal({ type: null, data: null });
  const handleSuccess = (message) => {
    alert(message);
    refetch();
    closeModal();
  };

  const handleStatusChange = async () => {
    if (modal.type !== "status") return;
    setIsSubmitting(true);
    try {
      const center = modal.data;
      await api.patch(`/api/centros-operacion/${center.id_centro_operacion}`, {
        activo: !center.activo,
      });
      closeModal();
      refetch();
    } catch (err) {
      console.error("Error al cambiar el estado del centro", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center w-full p-10">
        Cargando centros de operación...
      </div>
    );
  if (error)
    return <div className="text-center w-full p-10 text-error">{error}</div>;

  return (
    <div className="w-full">
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
