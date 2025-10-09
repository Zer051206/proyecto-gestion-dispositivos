import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore.js";
import { useDashboardDevice } from "../../hooks/devices/useDashboardDevice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTable,
  faThLarge,
  faEye,
  faArrowDown,
  faTimes,
  faDesktop,
  faKeyboard,
  faMemory,
  faHdd,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";

// --- SUBCOMPONENTE: Modal de Confirmación ---
const ConfirmDecommissionModal = ({
  asset,
  onConfirm,
  onCancel,
  isSubmitting,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
    <div className="bg-secondary rounded-lg shadow-xl p-6 w-full max-w-md text-center">
      <h3 className="text-xl font-bold text-accent mb-4">¿Estás Seguro?</h3>
      <p className="text-text-main mb-6">
        Estás a punto de dar de baja el activo con serial:{" "}
        <strong className="font-mono">
          {asset?.serial || asset?.serial_periferico}
        </strong>
        . Esta acción cambiará su estado a "De Baja".
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-text-main font-semibold disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="py-2 px-4 rounded-lg bg-accent text-text-light font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Procesando..." : "Sí, Dar de Baja"}
        </button>
      </div>
    </div>
  </div>
);

// --- SUBCOMPONENTE: Modal de Detalles ---
const AssetDetailModal = ({ asset, onClose }) => {
  if (!asset) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg shadow-xl p-6 w-full max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-xl font-bold text-primary">
            {asset.type === "equipo"
              ? "Detalle del Equipo"
              : "Detalle del Periférico"}
          </h3>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="space-y-3 text-text-main text-sm">
          <p>
            <strong>Serial:</strong>{" "}
            <span className="font-mono">
              {asset.serial || asset.serial_periferico}
            </span>
          </p>
          <p>
            <strong>Etiqueta:</strong>{" "}
            {asset.equipo_etiqueta || asset.etiqueta_periferico || "N/A"}
          </p>
          <p>
            <strong>Centro de Operación:</strong>{" "}
            {asset.OperationCenter?.codigo || "N/A"} -{" "}
            {asset.OperationCenter?.direccion}
          </p>
          <p>
            <strong>Registrado por:</strong> {asset.Creador?.nombre}{" "}
            {asset.Creador?.apellido}
          </p>
          <hr className="my-2 border-primary/20" />
          {asset.type === "equipo" && (
            <>
              <p>
                <strong>Tipo:</strong>{" "}
                {asset.equipo_laptop ? "Laptop" : "PC de Escritorio"}
              </p>
              <p>
                <strong>
                  <FontAwesomeIcon
                    icon={faHdd}
                    className="mr-2 text-neutral-taupe"
                  />
                  Disco Duro:
                </strong>{" "}
                {asset.tamano_disco_duro} GB
              </p>
              <p>
                <strong>
                  <FontAwesomeIcon
                    icon={faMicrochip}
                    className="mr-2 text-neutral-taupe"
                  />
                  Tarjeta Gráfica:
                </strong>{" "}
                {asset.equipo_tarjeta_grafica
                  ? asset.referencia_tarjeta_grafica || "Integrada"
                  : "No tiene"}
              </p>
              <p>
                <strong>Serial Pantalla:</strong>{" "}
                {asset.serial_pantalla || "N/A"}
              </p>
            </>
          )}
          {asset.type === "periferico" && (
            <>
              <p>
                <strong>Marca:</strong> {asset.marca_periferico}
              </p>
              <p>
                <strong>Tipo de Periférico:</strong>{" "}
                {asset.PeripheralType?.tipo_periferico || "No especificado"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTE: Tabla de Activos ---
const AssetTable = ({ assets, onAction }) => (
  <div className="overflow-x-auto bg-secondary rounded-lg shadow-md animate-fade-in">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 font-semibold">Tipo</th>
          <th className="p-4 font-semibold">Serial</th>
          <th className="p-4 font-semibold">Etiqueta</th>
          <th className="p-4 font-semibold hidden md:table-cell">Centro Op.</th>
          <th className="p-4 font-semibold">Estado</th>
          <th className="p-4 font-semibold text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr
            key={`${asset.type}-${asset.id_equipo || asset.id_periferico}`}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4">
              <FontAwesomeIcon
                icon={asset.type === "equipo" ? faDesktop : faKeyboard}
                className="text-lg text-neutral-taupe"
                title={asset.type}
              />
            </td>
            <td className="p-4 font-mono">
              {asset.serial || asset.serial_periferico}
            </td>
            <td className="p-4">
              {asset.equipo_etiqueta || asset.etiqueta_periferico || "N/A"}
            </td>
            <td className="p-4 hidden md:table-cell">
              {asset.OperationCenter?.codigo || "N/A"}
            </td>
            <td className="p-4">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  asset.estado_equipo ?? asset.estado_periferico
                    ? "bg-success/20 text-success"
                    : "bg-error/20 text-error"
                }`}
              >
                {asset.estado_equipo ?? asset.estado_periferico
                  ? "Activo"
                  : "De Baja"}
              </span>
            </td>
            <td className="p-4 text-center space-x-4">
              <button
                onClick={() => onAction("details", asset)}
                className="text-primary hover:opacity-70"
                title="Ver Detalles"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() => onAction("decommission", asset)}
                className="text-accent hover:opacity-70"
                title="Dar de Baja"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- SUBCOMPONENTE: Tarjetas de Activos ---
const AssetCards = ({ assets, onAction }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {assets.map((asset) => (
      <div
        key={`${asset.type}-${asset.id_equipo || asset.id_periferico}`}
        className="bg-secondary rounded-lg shadow p-4 flex flex-col justify-between animate-fade-in"
      >
        <div>
          <div className="flex justify-between items-start">
            <span className="font-bold text-lg text-text-main">
              {asset.equipo_etiqueta ||
                asset.etiqueta_periferico ||
                "Sin Etiqueta"}
            </span>
            <span
              className={`px-2 py-1 text-xs font-bold rounded-full ${
                asset.estado_equipo ?? asset.estado_periferico
                  ? "bg-success/20 text-success"
                  : "bg-error/20 text-error"
              }`}
            >
              {asset.estado_equipo ?? asset.estado_periferico
                ? "Activo"
                : "De Baja"}
            </span>
          </div>
          <p className="text-sm text-neutral-taupe font-mono">
            {asset.serial || asset.serial_periferico}
          </p>
          <p className="text-sm text-neutral-taupe capitalize">{asset.type}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => onAction("details", asset)}
            className="text-primary hover:opacity-70"
            title="Ver Detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onAction("decommission", asset)}
            className="text-accent hover:opacity-70"
            title="Dar de Baja"
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
      </div>
    ))}
  </div>
);

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function DashboardDevice() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { assets, isLoading, error, refetch, setSearchTerm, setFilterStatus } =
    useDashboardDevice();

  const isAdmin = user?.rol === "Admin";
  const initialView = isAdmin ? "table" : "card";
  const [viewMode, setViewMode] = useState(initialView);

  const [detailModalAsset, setDetailModalAsset] = useState(null);
  const [decommissionModalAsset, setDecommissionModalAsset] = useState(null);
  const [isDecommissioning, setIsDecommissioning] = useState(false);

  const handleDecommissionConfirm = async () => {
    if (!decommissionModalAsset) return;
    setIsDecommissioning(true);
    try {
      const assetId =
        decommissionModalAsset.id_equipo ||
        decommissionModalAsset.id_periferico;
      const assetType = decommissionModalAsset.type;
      await api.patch(`/api/${assetType}/${assetId}/decommission`);
      setDecommissionModalAsset(null);
      refetch();
    } catch (err) {
      console.error("Error al dar de baja el activo", err);
      // Aquí se podría mostrar un toast de error al usuario
    } finally {
      setIsDecommissioning(false);
    }
  };

  const handleAction = (type, asset) => {
    if (type === "details") setDetailModalAsset(asset);
    if (type === "decommission") setDecommissionModalAsset(asset);
  };

  if (isLoading)
    return (
      <div className="text-center w-full p-10 font-semibold text-text-main">
        Cargando activos...
      </div>
    );
  if (error)
    return (
      <div className="text-center flex justify-center items-center w-full p-10 text-error font-semibold">
        {error}
      </div>
    );

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold text-text-main">
          Gestión de Activos
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate("/equipos/crear")}
            className="bg-primary text-text-light font-semibold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faDesktop} />{" "}
            <span className="hidden sm:inline">Nuevo Equipo</span>
          </button>
          <button
            onClick={() => navigate("/perifericos/crear")}
            className="bg-accent-secondary text-text-light font-semibold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faKeyboard} />{" "}
            <span className="hidden sm:inline">Nuevo Periférico</span>
          </button>
          {isAdmin && (
            <div className="bg-gray-200 p-1 rounded-lg flex gap-1 ml-4">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "text-gray-600"
                }`}
                title="Vista de Tabla"
              >
                <FontAwesomeIcon icon={faTable} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "card"
                    ? "bg-primary text-white"
                    : "text-gray-600"
                }`}
                title="Vista de Tarjetas"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por serial o etiqueta..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        />
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="todos">Todos los Estados</option>
          <option value="activos">Solo Activos</option>
          <option value="baja">Dados de Baja</option>
        </select>
      </div>

      {assets.length === 0 && (
        <div className="text-center w-full p-10 text-neutral-taupe">
          No hay activos que coincidan con tu búsqueda.
        </div>
      )}

      {assets.length > 0 && (
        <>
          {viewMode === "table" && isAdmin ? (
            <AssetTable assets={assets} onAction={handleAction} />
          ) : (
            <AssetCards assets={assets} onAction={handleAction} />
          )}
        </>
      )}

      {detailModalAsset && (
        <AssetDetailModal
          asset={detailModalAsset}
          onClose={() => setDetailModalAsset(null)}
        />
      )}
      {decommissionModalAsset && (
        <ConfirmDecommissionModal
          asset={decommissionModalAsset}
          onCancel={() => setDecommissionModalAsset(null)}
          onConfirm={handleDecommissionConfirm}
          isSubmitting={isDecommissioning}
        />
      )}
    </div>
  );
}
