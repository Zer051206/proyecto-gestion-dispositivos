import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

export const useDashboardOperationCenter = () => {
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("codigo_asc");

  const fetchCenters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/centros-operacion");
      setCenters(response.data.operationCenters || []);
    } catch (err) {
      setError(
        "Error al cargar los centros de operación. Intenta recargar la página."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  // Lógica de filtrado y ordenación en el frontend
  const processedCenters = useMemo(() => {
    return [...centers]
      .filter((center) => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        const codigo = String(center.codigo).toLowerCase();
        const direccion = (center.direccion || "").toLowerCase();
        const correo = (center.correo || "").toLowerCase();
        return (
          codigo.includes(term) ||
          direccion.includes(term) ||
          correo.includes(term)
        );
      })
      .sort((a, b) => {
        const [field, order] = sortBy.split("_");
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [centers, searchTerm, sortBy]);

  return {
    centers: processedCenters,
    isLoading,
    error,
    refetch: fetchCenters,
    setSearchTerm,
    setSortBy,
  };
};
