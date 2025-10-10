import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

export const useDashboardHistory = () => {
  // Estado para saber qué pestaña está activa: 'logs' o 'bajas'
  const [activeTab, setActiveTab] = useState("logs");

  // Estados separados para cada tipo de dato
  const [logs, setLogs] = useState([]);
  const [bajas, setBajas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros y ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha_desc"); // fecha_desc, fecha_asc, etc.

  // Función para obtener los datos, se ejecuta cuando cambia la pestaña activa
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endpoint = activeTab === "logs" ? "/api/logs" : "/api/bajas";
        const response = await api.get(endpoint);

        if (activeTab === "logs") {
          setLogs(response.data.logs || []);
        } else {
          setBajas(response.data.bajas || []);
        }
      } catch (err) {
        setError(`Error al cargar el historial de ${activeTab}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Se vuelve a ejecutar cada vez que 'activeTab' cambia

  // Lógica de filtrado y ordenación
  const processedData = useMemo(() => {
    const data = activeTab === "logs" ? logs : bajas;

    return [...data]
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;

        // Lógica de búsqueda flexible
        const user = item.User?.nombre?.toLowerCase() || "";
        const accion = item.accion?.toLowerCase() || "";
        const serial = (
          item.Equipo?.serial ||
          item.Periferico?.serial_periferico ||
          ""
        ).toLowerCase();

        return (
          user.includes(term) || accion.includes(term) || serial.includes(term)
        );
      })
      .sort((a, b) => {
        const [field, order] = sortBy.split("_");
        const valA = (
          field === "fecha"
            ? new Date(a.fecha_log || a.fecha_baja)
            : a.User?.nombre || ""
        ).toString();
        const valB = (
          field === "fecha"
            ? new Date(b.fecha_log || b.fecha_baja)
            : b.User?.nombre || ""
        ).toString();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [logs, bajas, activeTab, searchTerm, sortBy]);

  return {
    data: processedData,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    setSearchTerm,
    setSortBy,
  };
};
