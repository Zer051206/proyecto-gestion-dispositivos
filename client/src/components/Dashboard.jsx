// src/components/DashboardPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersCog,
  faWarehouse,
  faDesktop,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js";

// --- Subcomponente NavButton (sin cambios, pero con colores temáticos) ---
const NavButton = ({ icon, text, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 text-center ${colorClass} text-text-light rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 min-h-[140px]`}
  >
    <FontAwesomeIcon icon={icon} className="text-3xl mb-2" />
    <span className="font-semibold text-lg">{text}</span>
  </button>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <>
      <div className="flex w-full justify-between mr-6 mb-6 md:fixed md:top-20 md:left-10 md:mt-2">
        {user?.rol === "Admin" && (
          <div className="mb-4 text-left font-semibold">
            <h2 className="text-primary">
              Bienvenido, {user?.nombre || "Usuario"}
            </h2>
            <p className="text-neutral-taupe">Rol: {user?.rol}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-16 md:mt-4 w-full text-center">
          Acciones Rápidas
        </h2>
      </div>

      <div className="justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Acción para todos */}
          <NavButton
            icon={faDesktop}
            text="Gestión de Dispositivos"
            onClick={() => navigate("/dashboard/dispositivos")}
            colorClass="bg-primary/90 hover:opacity-100"
          />
          <NavButton
            icon={faHistory}
            text="Historial y Auditoría"
            onClick={() => navigate("/dashboard/historial")}
            colorClass="bg-neutral-taupe/90 hover:opacity-100"
          />

          {/* Acciones SOLO PARA ADMINS */}
          {user?.rol === "Admin" && (
            <>
              <NavButton
                icon={faUsersCog}
                text="Gestión de Usuarios"
                onClick={() => navigate("/dashboard/usuarios")}
                colorClass="bg-accent/90 hover:opacity-100"
              />
              <NavButton
                icon={faWarehouse}
                text="Gestión de Centros"
                onClick={() => navigate("/dashboard/centros-operacion")}
                colorClass="bg-accent-secondary/90 hover:opacity-100"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
