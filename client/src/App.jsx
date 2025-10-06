import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./stores/authStore.js";
import { useEffect } from "react";
import { AppRoutes } from "./routes/index.jsx";
import "./App.css";

function App() {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <BrowserRouter>
      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
