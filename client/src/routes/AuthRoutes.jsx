import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const RegisterForm = lazy(() => import("../components/auth/RegisterForm.jsx"));
const LoginForm = lazy(() => import("../components/auth/LoginForm.jsx"));

export function AuthRoutes() {
  return (
    <Suspense
      fallback={
        <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
          Cargando...
        </div>
      }
    >
      <Routes>
        <Route path="register" element={<RegisterForm />} />
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </Suspense>
  );
}
