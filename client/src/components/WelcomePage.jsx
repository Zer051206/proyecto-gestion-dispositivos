// src/components/WelcomePage.jsx
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js";

export function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="text-xl text-text-main">Verificando sesión...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center gap-10 p-4 w-full min-h-screen justify-center animate-fade-in bg-background">
      <div className="flex flex-col items-center mb-5 text-center">
        <div className="w-24 h-24 mb-8 bg-secondary rounded-full flex items-center justify-center shadow-xl">
          <FontAwesomeIcon icon={faLock} className="text-4xl text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
          GESTIÓN DE DISPOSITIVOS
        </h1>
        <p className="text-lg sm:text-xl text-text-main max-w-lg">
          Sistema de control de dispositivos y acceso seguro.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 w-full">
        {/* Cajón de Iniciar Sesión (usa color primario) */}
        <Link
          to="/auth/login"
          className="flex flex-col items-center justify-center p-8 w-48 h-48 bg-primary/10 hover:bg-primary/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/50"
        >
          <div className="text-primary mb-2">
            <FontAwesomeIcon icon={faUser} className="w-16 h-16" />
          </div>
          <span className="text-lg font-bold text-text-main">
            Iniciar Sesión
          </span>
        </Link>

        {/* Cajón de Registrarse (usa color de acento) */}
        <Link
          to="/auth/register"
          className="flex flex-col items-center justify-center p-8 w-48 h-48 bg-accent/10 hover:bg-accent/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-accent/50"
        >
          <div className="text-accent mb-2">
            <FontAwesomeIcon icon={faUserPlus} className="w-16 h-16" />
          </div>
          <span className="text-lg font-bold text-text-main">
            Solicitar Acceso
          </span>
        </Link>
      </div>
    </div>
  );
}
