import React, { useState } from "react";
import { useDashboardHistory } from "../../hooks/history/useDashboardHistory.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTimes,
  faUserShield,
  faDesktop,
  faKeyboard,
  faCalendarAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

// --- SUBCOMPONENTES ---

const DetailModal = ({ item, onClose, type }) => {
  if (!item) return null;
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
            {type === "log" ? "Detalle del Registro" : "Detalle de la Baja"}
          </h3>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {type === "log" ? (
            <>
              <DetailRow
                label="Acción"
                value={item.accion}
                icon={faInfoCircle}
              />
              <DetailRow
                label="Usuario"
                value={`${item.User?.nombre} ${
                  item.User?.apellido || ""
                } (Rol: ${item.User?.rol})`}
                icon={faUserShield}
              />
              <DetailRow
                label="Fecha"
                value={new Date(item.fecha_log).toLocaleString()}
                icon={faCalendarAlt}
              />
              <DetailRow label="Dirección IP" value={item.ip_usuario} />
              <DetailRow label="Descripción" value={item.descripcion} />
            </>
          ) : (
            <>
              <DetailRow
                label="Activo Dado de Baja"
                value={
                  item.Equipo?.serial || item.Periferico?.serial_periferico
                }
                icon={item.Equipo ? faDesktop : faKeyboard}
              />
              <DetailRow
                label="Tipo"
                value={item.Equipo ? "Equipo" : "Periférico"}
              />
              <DetailRow
                label="Baja realizada por"
                value={`${item.User?.nombre} ${item.User?.apellido || ""}`}
                icon={faUserShield}
              />
              <DetailRow
                label="Fecha de Baja"
                value={new Date(item.fecha_baja).toLocaleString()}
                icon={faCalendarAlt}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LogTable = ({ logs, onAction }) => (
  <div className="overflow-x-auto bg-secondary rounded-lg shadow-md">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 font-semibold">Acción</th>
          <th className="p-4 font-semibold hidden sm:table-cell">Usuario</th>
          <th className="p-4 font-semibold hidden md:table-cell">Fecha</th>
          <th className="p-4 font-semibold text-center">Detalles</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr
            key={log.id_log}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 font-semibold">{log.accion}</td>
            <td className="p-4 hidden sm:table-cell">
              {log.User?.nombre} ({log.User?.rol})
            </td>
            <td className="p-4 hidden md:table-cell">
              {new Date(log.fecha_log).toLocaleDateString()}
            </td>
            <td className="p-4 text-center">
              <button
                onClick={() => onAction("log", log)}
                className="text-primary hover:opacity-70"
                title="Ver Detalles"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BajasTable = ({ bajas, onAction }) => (
  <div className="overflow-x-auto bg-secondary rounded-lg shadow-md">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 font-semibold">Activo</th>
          <th className="p-4 font-semibold hidden sm:table-cell">Tipo</th>
          <th className="p-4 font-semibold hidden md:table-cell">
            Usuario (Baja)
          </th>
          <th className="p-4 font-semibold">Fecha</th>
          <th className="p-4 font-semibold text-center">Detalles</th>
        </tr>
      </thead>
      <tbody>
        {bajas.map((baja) => (
          <tr
            key={baja.id_baja}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 font-mono">
              {baja.Equipo?.serial || baja.Periferico?.serial_periferico}
            </td>
            <td className="p-4 hidden sm:table-cell">
              {baja.Equipo ? "Equipo" : "Periférico"}
            </td>
            <td className="p-4 hidden md:table-cell">{baja.User?.nombre}</td>
            <td className="p-4">
              {new Date(baja.fecha_baja).toLocaleDateString()}
            </td>
            <td className="p-4 text-center">
              <button
                onClick={() => onAction("baja", baja)}
                className="text-primary hover:opacity-70"
                title="Ver Detalles"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function DashboardHistory() {
  const {
    data,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    setSearchTerm,
    setSortBy,
  } = useDashboardHistory();
  const [modal, setModal] = useState({ type: null, data: null });

  const handleAction = (type, item) => setModal({ type, data: item });
  const closeModal = () => setModal({ type: null, data: null });

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`py-2 px-4 font-semibold transition-colors ${
        activeTab === tabName
          ? "border-b-2 border-primary text-primary"
          : "text-neutral-taupe hover:text-text-main"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold text-text-main">
          Historial y Auditoría
        </h1>
      </header>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <TabButton tabName="logs" label="Registro de Acciones (Logs)" />
          <TabButton tabName="bajas" label="Registro de Bajas" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg"
        />
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded-lg"
        >
          <option value="fecha_desc">Más Recientes Primero</option>
          <option value="fecha_asc">Más Antiguos Primero</option>
          <option value="nombre_asc">Usuario (A-Z)</option>
          <option value="nombre_desc">Usuario (Z-A)</option>
        </select>
      </div>

      {isLoading && (
        <div className="text-center w-full p-10">Cargando datos...</div>
      )}
      {error && (
        <div className="text-center w-full p-10 text-error">{error}</div>
      )}
      {!isLoading && !error && data.length === 0 && (
        <div className="text-center w-full p-10 text-neutral-taupe">
          No hay registros que coincidan.
        </div>
      )}

      {!isLoading &&
        !error &&
        data.length > 0 &&
        (activeTab === "logs" ? (
          <LogTable logs={data} onAction={handleAction} />
        ) : (
          <BajasTable bajas={data} onAction={handleAction} />
        ))}

      {modal.data && (
        <DetailModal item={modal.data} onClose={closeModal} type={modal.type} />
      )}
    </div>
  );
}
