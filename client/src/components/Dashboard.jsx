// src/components/DashboardPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faBars,
  faTimes,
  faUserCircle,
  faLaptop,
  faUserPlus,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js"; // 1. Importamos el store global

// --- Subcomponente: Botón de Navegación (ahora usa clases semánticas) ---
const NavButton = ({ icon, text, onClick, colorClass = "bg-primary" }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 ${colorClass} text-text-light rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
  >
    <FontAwesomeIcon icon={icon} className="text-3xl mb-2" />
    <span className="font-semibold text-lg">{text}</span>
  </button>
);

// --- Subcomponente: Sidebar (ahora usa clases semánticas) ---
const Sidebar = ({ isOpen, toggleSidebar, navigate }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-neutral-cream text-neutral-taupe  z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-primary/50">
          <h2 className="text-xl font-bold text-primary">Menú Gestión</h2>
          <button onClick={toggleSidebar} className="text-neutral-taupe ">
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {/* Opciones del Sidebar */}
          <button
            onClick={() => {
              navigate("/gestion/personas");
              toggleSidebar();
            }}
            className="flex items-center w-full p-3 rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faUserCircle} className="mr-3 text-lg" />{" "}
            Gestión
          </button>

          <button
            onClick={() => {
              navigate("/gestion/dispositivos");
              toggleSidebar();
            }}
            className="flex items-center w-full p-3 rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faLaptop} className="mr-3 text-lg" /> Gestión
            de Dispositivos
          </button>
          {/* ... más opciones ... */}
        </nav>
      </div>
    </>
  );
};

// --- Componente Principal: DashboardPage ---
export default function DashboardPage() {
  const navigate = useNavigate();
  // 2. Obtenemos el usuario y la función de logout directamente del store
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-background">
      {/* Barra superior */}
      <header className="w-full max-w-6xl p-4 flex justify-between items-center">
        {/* Botón de Menú (móvil) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-primary text-text-light p-3 rounded-lg"
          aria-label="Abrir menú"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        {/* 3. Mensaje de bienvenida personalizado */}
        <div className="hidden md:block text-text-main">
          <h1 className="text-2xl font-bold">
            Bienvenido, {user?.nombre || "Usuario"}
          </h1>
          <p className="text-text-main">Rol: {user?.rol || "Desconocido"}</p>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={logout}
          className="bg-accent hover:opacity-90 text-text-light font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-opacity"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="w-full max-w-6xl p-4 flex-grow">
        <div className="text-center md:text-left mb-12">
          <h1 className="text-4xl font-extrabold text-primary md:hidden">
            Bienvenido, {user?.nombre || "Usuario"}
          </h1>
          <p className="text-text-main md:hidden">
            Rol: {user?.rol || "Desconocido"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Acciones Rápidas */}
          <NavButton
            icon={faPlusSquare}
            text="Dispositivos"
            onClick={() => navigate("/dashboard/dispositivos")}
            colorClass="bg-primary"
          />

          {user?.rol === "Admin" && (
            <NavButton
              icon={faUserPlus}
              text="Usuarios"
              onClick={() => navigate("/usuarios")}
              colorClass="bg-slate-600 hover:bg-slate-700"
            />
          )}
          <NavButton
            icon={faLaptop}
            text="Centros de operacion"
            onClick={() => navigate("/centros-operacion")}
            colorClass="bg-slate-500 hover:bg-slate-600"
          />
          {user?.rol === "Admin" && (
            <NavButton
              icon={faUserCircle}
              text="Registros"
              onClick={() => navigate("/registros")}
              colorClass="bg-slate-500 hover:bg-slate-600"
            />
          )}
        </div>

        {/* Aquí podrías añadir más secciones del dashboard, como estadísticas, etc. */}
      </main>

      {/* El Sidebar para móvil */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />
    </div>
  );
}
