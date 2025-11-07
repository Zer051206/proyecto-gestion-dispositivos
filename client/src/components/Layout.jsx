/**
 * @file Layout.jsx
 * @module Components
 * @description Componente de layout persistente para las rutas privadas de la aplicación.
 * Proporciona una estructura visual consistente que incluye una cabecera (`Header`) y una barra lateral
 * de navegación (`Sidebar`) para todas las páginas que renderiza a través del componente `<Outlet />` de React Router.
 * @requires react
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 * @requires ../stores/authStore.js
 */

import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersCog,
  faDesktop,
  faWarehouse,
  faHistory,
  faSignOutAlt,
  faBars,
  faTimes,
  faArrowLeft,
  faClipboardList,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function Header
 * @description Subcomponente que renderiza la cabecera superior de la aplicación.
 * Es "inteligente" y adapta su contenido según el rol del usuario y la ruta actual.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - El objeto del usuario autenticado.
 * @param {Function} props.logout - Función para cerrar la sesión del usuario.
 * @param {Function} props.toggleSidebar - Función para abrir/cerrar el `Sidebar` en vistas móviles.
 * @returns {JSX.Element}
 */
const Header = ({ user, logout, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSubPage = location.pathname !== "/dashboard";

  return (
    <header className="py-4 flex justify-between w-full items-center border-b border-neutral-taupe/20">
      <div className="">
        {user?.rol === "Admin" && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="bg-primary hover:bg-primary-dark text-text-light p-3 rounded-lg"
            aria-label="Abrir menú"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        )}
      </div>
      {user?.rol === "Encargado" && !isSubPage && (
        <div className="text-left font-semibold fixed top-0 left-0">
          <h2 className="text-primary">
            Bienvenido, {user?.nombre || "Usuario"}
          </h2>
          <p className="text-neutral-taupe">Rol: {user?.rol}</p>
        </div>
      )}

      {user.rol === "Encargado" && isSubPage && (
        <div className="text-left md:absolute md:top-0 hidden md:flex flex-col  justify-items-start font-semibold">
          <h2 className="text-primary">Nombre: {user?.nombre || "Usuario"}</h2>
          <p className="text-neutral-taupe">Rol: {user?.rol}</p>
        </div>
      )}

      {isSubPage && (
        <div className="justify-items-center flex">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 md:ml-8 text-text-main font-semibold hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver</span>
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-text-light font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

/**
 * @function Sidebar
 * @description Subcomponente que renderiza la barra lateral de navegación para Administradores.
 * Es un panel deslizable que contiene los enlaces a las principales secciones de gestión.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Estado que determina si el sidebar está visible.
 * @param {Function} props.toggleSidebar - Función para cerrar el sidebar.
 * @param {Function} props.navigate - Función de navegación de React Router.
 * @param {object} props.user - El objeto del usuario autenticado.
 * @returns {JSX.Element}
 */
const Sidebar = ({ isOpen, toggleSidebar, navigate, user }) => {
  const NavLink = ({ icon, text, path }) => (
    <button
      onClick={() => {
        navigate(path);
        toggleSidebar();
      }}
      className="flex items-center w-full p-3 rounded-md font-medium text-text-main hover:bg-primary hover:text-text-light transition-colors gap-3"
    >
      <FontAwesomeIcon icon={icon} className="text-lg w-6 text-center" />
      <span>{text}</span>
    </button>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm "
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-background border-l border-neutral-taupe/20 text-text-main z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Menú de Gestión</h2>
          <button
            onClick={toggleSidebar}
            className="text-text-main hover:opacity-70"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>
        <hr className="border-primary/20 mx-4" />
        <nav className="p-4 space-y-2">
          <NavLink icon={faHouse} text="Página de Inicio" path="/dashboard" />
          <NavLink
            icon={faUsersCog}
            text="Gestión de Usuarios"
            path="/dashboard/usuarios"
          />
          <NavLink
            icon={faDesktop}
            text="Gestión de Dispositivos"
            path="/dashboard/dispositivos"
          />
          {
            <NavLink
              icon={faWarehouse}
              text="Gestión de Centros"
              path="/dashboard/centros-operacion"
            />
          }
          <NavLink
            icon={faHistory}
            text="Historial"
            path="/dashboard/historial"
          />
          <NavLink
            icon={faClipboardList}
            text="Requerimientos"
            path="/dashboard/requerimientos"
          />
        </nav>
      </div>
    </>
  );
};

/**
 * @function Layout
 * @description Componente principal del layout autenticado. Renderiza la estructura
 * común (Header, Sidebar) y utiliza `<Outlet />` para renderizar el contenido de la página actual.
 * @returns {JSX.Element}
 */
export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * @async
   * @function handleLogout
   * @description Orquesta el proceso de cierre de sesión: llama a la acción del store y luego redirige.
   */
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  /**
   * @function toggleSidebar
   * @description Abre o cierra el sidebar. Solo funciona si el usuario es un 'Admin'.
   */
  const toggleSidebar = () =>
    user?.rol === "Admin" && setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="w-full min-h-screen bg-background text-text-main">
      <div className="container mx-auto px-4 max-w-7xl">
        <Header
          user={user}
          logout={handleLogout}
          toggleSidebar={toggleSidebar}
        />

        <main className="p-3 mb-4 flex flex-col items-center justify-center">
          <Outlet />
        </main>
      </div>

      {user?.rol === "Admin" && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          navigate={navigate}
          user={user}
        />
      )}
    </div>
  );
}
