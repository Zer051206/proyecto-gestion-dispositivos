/**
 * @file DashboardUser.jsx
 * @module Components/Users
 * @description Página principal para la gestión de usuarios. Permite a los administradores
 * visualizar, buscar, filtrar y gestionar el estado de todos los usuarios del sistema.
 * Incluye funcionalidades para cambiar entre vistas de tabla y tarjetas, y modales para
 * ver detalles y cambiar el estado de un usuario.
 */
import React, { useState } from "react";
import { useDashboardUser } from "../../hooks/users/useDashboardUser.js";
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
} from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import CreateUserModal from "./CreateUserForm.jsx";
import { toast } from "react-hot-toast";

// --- SUBCOMPONENTES ---

/**
 * @function UserDetailModal
 * @description Modal que muestra información detallada de un usuario.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - El objeto de usuario a mostrar.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @returns {JSX.Element|null}
 */
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const DetailRow = ({ label, value, icon }) => (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <p className="text-sm text-neutral-taupe font-semibold flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className="w-4 text-primary/70" />
        {label}
      </p>
      <p className="text-md text-text-main pl-6">
        {value || "No especificado"}
      </p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg shadow-xl w-full max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-bold text-primary">
            Detalles del Usuario
          </h3>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-text-main">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-md text-primary font-semibold">{user.rol}</p>
          </div>
          <DetailRow
            label="Correo Electrónico"
            value={user.correo}
            icon={faEye}
          />
          <DetailRow
            label="Identificación"
            value={`${user.IdentificationType?.tipo_identificacion || ""} - ${
              user.identificacion
            }`}
            icon={faIdCard}
          />
          <DetailRow label="Teléfono" value={user.telefono} icon={faPhone} />
          {user.rol === "Encargado" && (
            <DetailRow
              label="Centro de Operación"
              value={`${user.CentroAsignado?.codigo || ""} - ${
                user.CentroAsignado?.direccion
              }`}
              icon={faBuilding}
            />
          )}
          <DetailRow
            label="Creado por (Admin)"
            value={user.Creador?.nombre || "Sistema"}
            icon={faUserShield}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * @function ConfirmStatusChangeModal
 * @description Modal de confirmación para activar o desactivar la cuenta de un usuario.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const ConfirmStatusChangeModal = ({
  user,
  onConfirm,
  onCancel,
  isSubmitting,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="bg-secondary rounded-lg shadow-xl p-6 w-full max-w-md text-center animate-fade-in-up">
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
        Estás a punto de{" "}
        <strong className={user.activo ? "text-accent" : "text-success"}>
          {user.activo ? "desactivar" : "activar"}
        </strong>{" "}
        la cuenta de{" "}
        <strong className="font-semibold">
          {user.nombre} {user.apellido}
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
          className={`py-2 px-4 rounded-lg text-white font-bold hover:opacity-90 ${
            user.activo ? "bg-accent" : "bg-success"
          }`}
        >
          {isSubmitting
            ? "Procesando..."
            : `Sí, ${user.activo ? "Desactivar" : "Activar"}`}
        </button>
      </div>
    </div>
  </div>
);

/**
 * @function UserTable
 * @description Componente que renderiza una tabla de usuarios.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const UserTable = ({ users, onAction }) => (
  <div className="overflow-auto bg-secondary rounded-lg shadow-md max-h-[500px] animate-fade-in">
    <table className="w-full text-left text-text-main">
      <thead className="bg-gray-100/80">
        <tr>
          <th className="p-4 whitespace-nowrap font-semibold">Nombre</th>
          <th className="p-4 whitespace-nowrap font-semibold hidden sm:table-cell">
            Identificación
          </th>
          <th className="p-4 whitespace-nowrap font-semibold">Rol</th>
          <th className="p-4 whitespace-nowrap font-semibold ">Centro Op.</th>
          <th className="p-4 whitespace-nowrap font-semibold">Estado</th>
          <th className="p-4 whitespace-nowrap font-semibold text-center">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id_usuario}
            className="border-t border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 whitespace-nowrap">
              <p className="font-bold">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-sm text-gray-500">{user.correo}</p>
            </td>
            <td className="p-4 whitespace-nowrap font-mono hidden md:table-cell">
              {user.identificacion}
            </td>
            <td className="p-4 whitespace-nowrap">{user.rol}</td>
            <td className="p-4 whitespace-nowrap">
              {user.CentroAsignado?.codigo ||
                (user.rol === "Admin" ? "Global" : "N/A")}
            </td>
            <td className="p-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  user.activo
                    ? "bg-success/20 text-success"
                    : "bg-error/20 text-error"
                }`}
              >
                {user.activo ? "Activo" : "Inactivo"}
              </span>
            </td>
            <td className="p-4 whitespace-nowrap text-center space-x-4">
              <button
                onClick={() => onAction("details", user)}
                className="text-primary hover:opacity-70"
                title="Ver Detalles"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() => onAction("status", user)}
                className="text-accent hover:opacity-70"
                title="Cambiar Estado"
              >
                <FontAwesomeIcon
                  icon={user.activo ? faToggleOn : faToggleOff}
                  className={user.activo ? "text-success" : "text-gray-400"}
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
 * @function UserCards
 * @description Componente que renderiza una cuadrícula de tarjetas de usuarios.
 * @param {object} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const UserCards = ({ users, onAction }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
    {users.map((user) => (
      <div
        key={user.id_usuario}
        className="bg-secondary rounded-lg shadow p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold text-lg text-text-main">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-sm text-primary font-semibold">{user.rol}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-bold rounded-full ${
                user.activo
                  ? "bg-success/20 text-success"
                  : "bg-error/20 text-error"
              }`}
            >
              {user.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
          <p className="text-sm text-neutral-taupe">{user.correo}</p>
          {user.rol === "Encargado" && (
            <p className="text-sm text-neutral-taupe">
              Centro: {user.CentroAsignado?.codigo || "N/A"} -{" "}
              {user.CentroAsignado?.direccion}
            </p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => onAction("details", user)}
            className="text-primary hover:opacity-70"
            title="Ver Detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onAction("status", user)}
            className="text-accent hover:opacity-70"
            title="Cambiar Estado"
          >
            <FontAwesomeIcon
              icon={user.activo ? faToggleOn : faToggleOff}
              className={user.activo ? "text-success" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    ))}
  </div>
);

/**
 * @function DashboardSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del Dashboard de Usuarios.
 * @returns {JSX.Element}
 */
const DashboardSkeleton = () => (
  <div className="w-full animate-pulse">
    {/* Esqueleto de la Cabecera */}
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
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
            className="flex items-center space-x-4 p-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24 hidden sm:block"></div>
            <div className="h-4 bg-gray-200 rounded w-16 hidden lg:block"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * @function UserDashboard
 * @description Componente principal de la página de gestión de usuarios.
 * Orquesta la obtención de datos, los filtros, el cambio de vistas (tabla/tarjetas) y la gestión de modales.
 * @returns {JSX.Element}
 */
export default function UserDashboard() {
  const { users, isLoading, error, refetch, setSearchTerm, setSortBy } =
    useDashboardUser();
  const [viewMode, setViewMode] = useState("table");
  const [modal, setModal] = useState({ type: null, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * @function handleAction
   * @description Abre un modal de un tipo específico con los datos de un usuario.
   * @param {'createUser'|'details'|'status'} type - El tipo de modal a abrir.
   * @param {object|null} user - Los datos del usuario para el modal.
   */
  const handleAction = (type, user = null) => setModal({ type, data: user });

  /**
   * @function closeModal
   * @description Cierra cualquier modal que esté abierto.
   */
  const closeModal = () => setModal({ type: null, data: null });

  /**
   * @function handleSuccess
   * @description Callback que se ejecuta tras una creación exitosa de usuario. Muestra una notificación.
   * @param {string} message - El mensaje de éxito a mostrar.
   */
  const handleSuccess = (message) => {
    toast.success(message);
    refetch();
    closeModal();
  };

  /**
   * @async
   * @function handleStatusChange
   * @description Maneja la lógica para cambiar el estado (activo/inactivo) de un usuario.
   * Muestra notificaciones de carga, éxito y error.
   */
  const handleStatusChange = async () => {
    if (modal.type !== "status") return;

    const user = modal.data;
    const newState = !user.activo;
    const actionText = newState ? "activado" : "desactivado";

    setIsSubmitting(true);

    try {
      await toast.promise(
        api.patch(`/api/usuarios/${user.id_usuario}/estado`, {
          activo: newState,
        }),
        {
          loading: `Cambiando estado de ${user.nombre}...`,
          success: `¡Usuario ${actionText} exitosamente!`,
          error: (err) =>
            err.response?.data?.message ||
            `Error al ${actionText.slice(0, -1)}ar el usuario.`,
        }
      );
    } catch (err) {
      console.log("Fallo la promesa del toast al cambiar estado:", err);
    } finally {
      closeModal();
      refetch();
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <DashboardSkeleton />;
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
          Gestión de Usuarios
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAction("createUser")}
            className="bg-primary text-text-light font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Usuario</span>
          </button>
          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table" ? "bg-primary text-white" : "text-gray-600"
              }`}
              title="Vista de Tabla"
            >
              <FontAwesomeIcon icon={faTable} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "card" ? "bg-primary text-white" : "text-gray-600"
              }`}
              title="Vista de Tarjetas"
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o identificación..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        />
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="nombre_asc">Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
          <option value="identificacion_asc">Identificación (Asc)</option>
          <option value="identificacion_desc">Identificación (Desc)</option>
        </select>
      </div>

      {users.length === 0 ? (
        <div className="text-center w-full p-10 text-neutral-taupe">
          No hay usuarios que coincidan con tu búsqueda.
        </div>
      ) : viewMode === "table" ? (
        <UserTable users={users} onAction={handleAction} />
      ) : (
        <UserCards users={users} onAction={handleAction} />
      )}

      {/* --- RENDERIZADO DE TODOS LOS MODALES --- */}
      {modal.type === "createUser" && (
        <CreateUserModal onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {modal.type === "details" && (
        <UserDetailModal user={modal.data} onClose={closeModal} />
      )}
      {modal.type === "status" && (
        <ConfirmStatusChangeModal
          user={modal.data}
          onCancel={closeModal}
          onConfirm={handleStatusChange}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
