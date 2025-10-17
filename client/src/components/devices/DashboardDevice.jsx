/**
 * @file DashboardDevice.jsx
 * @module Components/Devices
 * @description Página principal para la gestión de activos (equipos y periféricos).
 * Permite visualizar, buscar, filtrar y gestionar el estado de todos los activos.
 * Implementa una arquitectura de componentes con modales para las acciones principales
 * y adapta su interfaz (tabla vs. tarjetas) según el rol del usuario.
 */
import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore.js";
import { useDashboardDevice } from "../../hooks/devices/useDashboardDevice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faTable,
  faThLarge,
  faEye,
  faArrowDown,
  faTimes,
  faDesktop,
  faKeyboard,
  faExclamationTriangle,
  faHdd,
  faMicrochip,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import CreateDeviceForm from "./CreateDevicesForm.jsx";
import CreatePeripheralForm from "./CreatePeripheralsForm.jsx";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../../utils/exportUtils.js";

// --- SUBCOMPONENTES ---

/**
 * @function ConfirmStatusChangeModal
 * @description Modal de confirmación para dar de baja o reactivar un activo.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.asset - El activo sobre el cual se realizará la acción.
 * @param {Function} props.onConfirm - Callback a ejecutar al confirmar la acción.
 * @param {Function} props.onCancel - Callback a ejecutar al cancelar.
 * @param {boolean} props.isSubmitting - Estado de carga para deshabilitar botones.
 * @returns {JSX.Element}
 */
const ConfirmStatusChangeModal = ({
  asset,
  onConfirm,
  onCancel,
  isSubmitting,
}) => {
  const isActive = asset.estado_equipo ?? asset.estado_periferico;
  const actionText = isActive ? "dar de baja" : "reactivar";
  const actionColor = isActive ? "accent" : "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="bg-secondary rounded-lg shadow-xl p-6 w-full max-w-md text-center">
        <div
          className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-${actionColor}/10 mb-4`}
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={`h-6 w-6 text-${actionColor}`}
          />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">
          ¿Estás Seguro?
        </h3>
        <p className="text-text-main mb-6">
          Estás a punto de{" "}
          <strong className={`font-semibold text-${actionColor}`}>
            {actionText}
          </strong>{" "}
          el activo con serial:{" "}
          <strong className="font-mono">
            {asset?.serial || asset?.serial_periferico}
          </strong>
          .
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
            className={`py-2 px-4 rounded-lg text-white font-bold hover:opacity-90 bg-${actionColor}`}
          >
            {isSubmitting
              ? "Procesando..."
              : `Sí, ${
                  actionText.charAt(0).toUpperCase() + actionText.slice(1)
                }`}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @function AssetDetailModal
 * @description Modal que muestra información detallada de un activo (equipo o periférico).
 * @param {object} props - Propiedades del componente.
 * @param {object} props.asset - El objeto del activo a mostrar.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @returns {JSX.Element|null}
 */
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
            {asset.type === "device"
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
            <strong>Tipo:</strong>{" "}
            {asset.equipo_laptop ? "Laptop" : "PC de Escritorio"}
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
          {asset.type === "device" && (
            <>
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
          {asset.type === "peripheral" && (
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

/**
 * @function AssetTable
 * @description Componente que renderiza una tabla de activos.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.assets - El array de activos a mostrar.
 * @param {Function} props.onAction - Callback para manejar acciones en cada fila.
 * @returns {JSX.Element}
 */
const AssetTable = ({ assets, onAction }) => (
  <div className="overflow-auto max-h-[500px] bg-secondary rounded-lg shadow-md animate-fade-in">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 font-semibold">Tipo</th>
          <th className="p-4 font-semibold">Serial</th>
          <th className="p-4 font-semibold hidden md:table-cell">Centro Op.</th>
          <th className="p-4 font-semibold">Estado</th>
          <th className="p-4 font-semibold text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => {
          const isActive = asset.estado_equipo ?? asset.estado_periferico;
          return (
            <tr
              key={`${asset.type}-${asset.id_equipo || asset.id_periferico}`}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="p-4 whitespace-nowrap">
                <FontAwesomeIcon
                  icon={asset.type === "device" ? faDesktop : faKeyboard}
                  className="text-lg text-neutral-taupe"
                  title={asset.type}
                />
              </td>
              <td className="p-4 whitespace-nowrap">
                <span className="font-mono">
                  {asset.serial || asset.serial_periferico}
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  {asset.equipo_etiqueta || asset.etiqueta_periferico || ""}
                </span>
              </td>
              <td className="p-4 hidden md:table-cell whitespace-nowrap">
                {asset.OperationCenter?.codigo || "N/A"}
              </td>
              <td className="p-4 whitespace-nowrap">
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
              <td className="p-4 text-center space-x-4 whitespace-nowrap">
                <button
                  onClick={() => onAction("details", asset)}
                  className="text-primary hover:opacity-70"
                  title="Ver Detalles"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                {/* --- BOTÓN DE ACCIÓN CONDICIONAL --- */}
                {isActive ? (
                  <button
                    onClick={() => onAction("status", asset)}
                    className="text-accent hover:opacity-70"
                    title="Dar de Baja"
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </button>
                ) : (
                  <button
                    onClick={() => onAction("status", asset)}
                    className="text-success hover:opacity-70"
                    title="Reactivar"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/**
 * @function AssetCards
 * @description Componente que renderiza una cuadrícula de tarjetas de activos.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.assets - El array de activos a mostrar.
 * @param {Function} props.onAction - Callback para manejar acciones en cada tarjeta.
 * @returns {JSX.Element}
 */
const AssetCards = ({ assets, onAction }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {assets.map((asset) => {
      const isActive = asset.estado_equipo ?? asset.estado_periferico;
      return (
        <div
          key={`${asset.type}-${asset.id_equipo || asset.id_periferico}`}
          className="bg-secondary rounded-lg shadow p-4 flex flex-col justify-between animate-fade-in"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg text-text-main">
                {asset.serial || asset.serial_periferico || "Sin Serial"}
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
            <p className="text-sm text-neutral-taupe capitalize">
              {asset.type === "device" ? "Equipo" : "Periferico"}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={() => onAction("details", asset)}
              className="text-primary hover:opacity-70"
              title="Ver Detalles"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            {/* --- BOTÓN DE ACCIÓN CONDICIONAL --- */}
            {isActive ? (
              <button
                onClick={() => onAction("status", asset)}
                className="text-accent hover:opacity-70"
                title="Dar de Baja"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            ) : (
              <button
                onClick={() => onAction("status", asset)}
                className="text-success hover:opacity-70"
                title="Reactivar"
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

/**
 * @function DashboardSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del Dashboard de Dispositivos.
 * @returns {JSX.Element}
 */
const DashboardSkeleton = () => (
  <div className="w-full animate-pulse">
    {/* Esqueleto de la Cabecera */}
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="h-10 bg-gray-200 rounded w-2/5"></div>
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-200 rounded w-36"></div>
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
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
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
 * @function DashboardDevice
 * @description Componente principal de la página de gestión de activos.
 * Orquesta la obtención de datos, los filtros, el cambio de vistas y la gestión de modales.
 * @returns {JSX.Element}
 */
export default function DashboardDevice() {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";
  const [viewMode, setViewMode] = useState(isAdmin ? "table" : "card");
  const {
    originalAssets,
    filteredAssets,
    isLoading,
    error,
    refetch,
    setSearchTerm,
    setFilterStatus,
  } = useDashboardDevice();
  const [modal, setModal] = useState({ type: null, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  /**
   * @async
   * @function handleExport
   * @description Maneja la lógica para exportar los datos actualmente visibles a un archivo de Excel.
   * Muestra un estado de carga y notificaciones de éxito/error.
   */
  const handleExport = async () => {
    console.log("🚀 ~ handleExport ~ assets:", originalAssets);
    if (originalAssets.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }

    setIsExporting(true);
    await toast.promise(
      exportToExcel(
        originalAssets,
        `Inventario_Activos_${new Date().toLocaleDateString("es-CO")}`
      ),
      {
        loading: "Generando archivo de Excel...",
        success: "¡Archivo de Excel generado exitosamente!",
        error: "Error al generar el archivo.",
      }
    );
    setIsExporting(false);
  };

  /**
   * @function handleAction
   * @description Centraliza el manejo de apertura de modales.
   * @param {'createDevice'|'createPeripheral'|'details'|'status'} type - El tipo de modal a abrir.
   * @param {object|null} [asset=null] - Los datos del activo para los modales de detalle o estado.
   */
  const handleAction = (type, asset = null) => setModal({ type, data: asset });

  /**
   * @function closeModal
   * @description Cierra cualquier modal que esté abierto.
   */
  const closeModal = () => setModal({ type: null, data: null });

  /**
   * @function handleSuccess
   * @description Callback que se ejecuta tras una creación exitosa. Muestra una notificación y recarga los datos.
   * @param {string} message - El mensaje de éxito a mostrar.
   */
  const handleSuccess = (successMessage) => {
    toast.success(successMessage);
    refetch();
    closeModal();
  };

  /**
   * @async
   * @function handleStatusChange
   * @description Maneja la lógica para cambiar el estado de un activo usando toast.promise.
   */
  const handleStatusChange = async () => {
    if (modal.type !== "status") return;

    const asset = modal.data;
    const newState = !(asset.estado_equipo ?? asset.estado_periferico);
    const actionText = newState ? "reactivado" : "dado de baja";
    const assetId = asset.id_equipo || asset.id_periferico;
    const endpoint =
      asset.type === "equipo"
        ? `/api/equipos/${assetId}/estado`
        : `/api/perifericos/${assetId}/estado`;
    const payload =
      asset.type === "equipo"
        ? { estado_equipo: newState }
        : { estado_periferico: newState };

    setIsSubmitting(true);

    await toast.promise(api.patch(endpoint, payload), {
      loading: `Cambiando estado del activo...`,
      success: `¡Activo ${actionText} exitosamente!`,
      error: (err) =>
        err.response?.data?.message || `Error al cambiar el estado.`,
    });

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
          Gestión de Activos
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          {/* Los botones ahora llaman a handleAction para abrir el modal correcto */}
          <button
            onClick={() => handleAction("createDevice")}
            className="bg-primary text-text-light font-semibold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faDesktop} />{" "}
            <span className="hidden sm:inline">Nuevo Equipo</span>
          </button>
          <button
            onClick={() => handleAction("createPeripheral")}
            className="bg-accent-secondary text-text-light font-semibold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faKeyboard} />{" "}
            <span className="hidden sm:inline">Nuevo Periférico</span>
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-green-700 text-text-light font-semibold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faFileExcel} />
            <span className="hidden sm:inline">
              {isExporting ? "Exportando..." : "Exportar a Excel"}
            </span>
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

      {filteredAssets.length === 0 ? (
        <div className="text-center w-full p-10 text-neutral-taupe">
          No hay activos que mostrar.
        </div>
      ) : viewMode === "table" && isAdmin ? (
        <AssetTable assets={filteredAssets} onAction={handleAction} />
      ) : (
        <AssetCards assets={filteredAssets} onAction={handleAction} />
      )}

      {/* --- 3. RENDERIZADO CONDICIONAL DE TODOS LOS MODALES --- */}
      {modal.type === "createDevice" && (
        <CreateDeviceForm onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {modal.type === "createPeripheral" && (
        <CreatePeripheralForm onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {modal.type === "details" && (
        <AssetDetailModal asset={modal.data} onClose={closeModal} />
      )}
      {modal.type === "status" && (
        <ConfirmStatusChangeModal
          asset={modal.data}
          onCancel={closeModal}
          onConfirm={handleStatusChange}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
