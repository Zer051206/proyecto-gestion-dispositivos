// src/hooks/catalogs/useCatalogs.js
import { useState, useEffect } from "react";
import api from "../../config/axios.js";

export const useCatalogs = () => {
  const [data, setData] = useState({
    tiposIdentificacion: [],
    centrosOperacion: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [tiposIdRes, centrosOpRes] = await Promise.all([
          api.get("/api/catalogos/tipos-identificacion"),
          api.get("/api/centros-operacion"),
        ]);
        setData({
          tiposIdentificacion: tiposIdRes.data,
          centrosOperacion: centrosOpRes.data,
        });
      } catch (err) {
        setError("Error al cargar los catálogos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  return { ...data, isLoading, error };
};
