/**
 * @file DashboardPage.jsx
 * @module DashboardPage
 * @description Componente principal que sirve como la página de inicio para los usuarios autenticados.
 * Muestra enlaces de navegación clave y un Sidebar desplegable para gestión, utilizando la paleta de seguridad (Esmeralda).
 * @component
 * @requires react/useState
 * @requires react-router-dom/useNavigate
 * @requires ../hooks/auth/useAuthLogout
 * @requires @fortawesome/react-fontawesome
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faBars, // Ícono para abrir el sidebar
  faTimes, // Ícono para cerrar el sidebar
  faUserCircle, // Gestión de Personas
  faLaptop, // Gestión de Dispositivos (o cualquier otro ícono de dispositivo)
  faClipboardList, // Historial
  faPlusSquare, // Crear Asignación (o faBoxOpen para la acción de paquete)
  faBoxOpen, // Gestión de Paquetes
} from "@fortawesome/free-solid-svg-icons";

import useAuthLogout from "../hooks/auth/useAuthLogout.js";

// Botón/Enlace de Navegación ---
const NavButton = ({ icon, text, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 ${colorClass} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
  >
    <FontAwesomeIcon icon={icon} className="text-3xl mb-2" />
    <span className="font-semibold text-lg">{text}</span>
  </button>
);

// --- Subcomponente: Sidebar con Opciones de Gestión ---
const Sidebar = ({ isOpen, toggleSidebar, navigate }) => {
  return (
    <>
      {/* Overlay Oscuro */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-800/70 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Principal */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:translate-x-0 md:w-auto md:bg-transparent md:z-auto`}
      >
        <div className="p-4 flex justify-between items-center border-b border-emerald-700 md:hidden">
          <h2 className="text-xl font-bold text-emerald-400">Menú Gestión</h2>
          <button onClick={toggleSidebar} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden md:block">
            Gestión Rápida
          </h3>

          {/* Opción: Gestión de Personas */}
          <button
            onClick={() => {
              navigate("/gestion/personas");
              toggleSidebar();
            }}
            className="flex items-center w-full p-3 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <FontAwesomeIcon icon={faUserCircle} className="mr-3 text-lg" />
            Gestión de Personas
          </button>

          {/* Opción: Gestión de Dispositivos */}
          <button
            onClick={() => {
              navigate("/gestion/dispositivos");
              toggleSidebar();
            }}
            className="flex items-center w-full p-3 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <FontAwesomeIcon icon={faLaptop} className="mr-3 text-lg" />
            Gestión de Dispositivos
          </button>

          {/* Opción: Gestión de Paquetes (Agregado para un flujo completo) */}
          <button
            onClick={() => {
              navigate("/gestion/paquetes");
              toggleSidebar();
            }}
            className="flex items-center w-full p-3 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <FontAwesomeIcon icon={faBoxOpen} className="mr-3 text-lg" />
            Gestión de Paquetes
          </button>
        </nav>
      </div>
    </>
  );
};

// --- Componente Principal: DashboardPage ---
export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuthLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      {/* Barra superior y Botones de acción fijos */}
      <div className="w-full max-w-4xl flex justify-between items-start pt-4 relative">
        {/* Botón de Menú/Sidebar (Visible en móvil) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="
            bg-emerald-600 hover:bg-emerald-700 
            text-white font-bold 
            p-3 rounded-lg 
            flex items-center justify-center 
            transition-colors duration-300
            text-sm w-12 h-12 md:hidden
          "
          aria-label="Abrir menú de gestión"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        {/* Placeholder para centrar el título visualmente en el escritorio */}
        <div className="w-12 h-12 hidden md:block"></div>

        {/* Título de la página (Centrado en pantalla grande) */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mb-8 mt-4 text-center absolute left-1/2 transform -translate-x-1/2 w-full max-w-xs md:relative md:translate-x-0 md:left-auto">
          Dashboard
        </h1>

        {/* Botón de Cerrar Sesión (Color de Alerta/Salida) */}
        <button
          type="button"
          onClick={logout}
          className="
            bg-red-600 hover:bg-red-700 
            text-white font-bold 
            p-4 rounded-lg 
            flex flex-col items-center justify-center 
            transition-colors duration-300
            text-sm w-16 h-16 sm:w-20 sm:h-20
          "
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-xl sm:text-xl" />
          <span className="text-xs sm:text-sm mt-1">Salir</span>
        </button>
      </div>

      {/* Contenido Principal: Botones de Acción */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16 md:mt-24 mb-8 text-center">
        {/* Botón 1: Crear Asignación (La acción más importante) */}
        <NavButton
          icon={faPlusSquare}
          text="Nueva Asignación"
          onClick={() => navigate("/asignaciones/crear")}
          colorClass="bg-emerald-700 hover:bg-emerald-800"
        />

        {/* Botón 2: Historial (Consulta general) */}
        <NavButton
          icon={faClipboardList}
          text="Historial General"
          onClick={() => navigate("/historial")}
          colorClass="bg-gray-600 hover:bg-gray-700"
        />

        {/* Botón 3: Gestión (Abre el Sidebar en escritorio o móvil) */}
        <NavButton
          icon={faBars}
          text="Menú de Gestión"
          onClick={toggleSidebar}
          colorClass="bg-gray-500 hover:bg-gray-600"
        />
      </div>

      {/* Inclusión del Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />
    </div>
  );
}
