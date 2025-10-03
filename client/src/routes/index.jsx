import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { WelcomePage } from "../components/WelcomePage.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* ==================================== */}
      {/* Rutas Públicas              */}
      {/* ==================================== */}

      {/* Ruta de la pagina de bienvenida de la aplicacion */}
      <Route path="/" element={<WelcomePage.jsx />} />

      {/* Rutas de Autenticación (Login, Register) - Rutas anidadas */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Ruta de redirección para errores de autenticación (ej: token de refresco fallido) */}
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      {/* ==================================== */}
      {/* Rutas Privadas              */}
      {/* ==================================== */}
    </Routes>
  );
}
