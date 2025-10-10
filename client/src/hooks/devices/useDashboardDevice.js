// src/hooks/devices/useDashboardDevice.js
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

export const useDashboardDevice = () => {
  const { user } = useAuthStore();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Función para obtener los datos, envuelta en useCallback
  const fetchAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/activos");
      setAssets(response.data.assets || []);
    } catch (err) {
      setError("Error al cargar los activos. Intenta recargar la página.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect para la carga inicial
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Lógica de filtrado en el frontend
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        if (filterStatus === "activos")
          return asset.estado_equipo || asset.estado_periferico;
        if (filterStatus === "baja")
          return !(asset.estado_equipo || asset.estado_periferico);
        return true;
      })
      .filter((asset) => {
        const term = searchTerm.toLowerCase();
        const serial = asset.serial || asset.serial_periferico || "";
        const etiqueta =
          asset.equipo_etiqueta || asset.etiqueta_periferico || "";
        return (
          serial.toLowerCase().includes(term) ||
          etiqueta.toLowerCase().includes(term)
        );
      });
  }, [assets, searchTerm, filterStatus]);

  return {
    assets: filteredAssets,
    isLoading,
    error,
    refetch: fetchAssets,
    setSearchTerm,
    setFilterStatus,
  };
};
