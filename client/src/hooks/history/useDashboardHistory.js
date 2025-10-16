/**
 * @file useDashboardHistory.js
 * @module Hooks/History
 * @description Hook personalizado para gestionar los datos y el estado de la UI del dashboard de Historial.
 * Se encarga de manejar la lógica de pestañas (tabs) para mostrar 'Logs' o 'Bajas',
 * obtener los datos correspondientes desde la API y aplicar filtros de búsqueda y ordenación.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

/**
 * @function useDashboardHistory
 * @description Hook de React que encapsula toda la lógica para la página de historial y auditoría.
 * Gestiona el estado de la pestaña activa, obtiene los datos de logs o bajas según corresponda,
 * y proporciona funciones para filtrar y ordenar la lista de datos mostrada.
 * @returns {{
 * data: Array<object>,
 * activeTab: string,
 * setActiveTab: Function,
 * isLoading: boolean,
 * error: string|null,
 * setSearchTerm: Function,
 * setSortBy: Function
 * }} Un objeto que contiene los datos procesados, el estado de la pestaña activa, y las funciones para interactuar con los filtros.
 */
export const useDashboardHistory = () => {
  /**
   * @state
   * @description Almacena la pestaña actualmente seleccionada por el usuario ('logs' o 'bajas').
   * @type {[string, Function]}
   */
  const [activeTab, setActiveTab] = useState("logs");

  /**
   * @state
   * @description Almacena la lista original de registros de logs obtenida de la API.
   * @type {[Array<object>, Function]}
   */
  const [logs, setLogs] = useState([]);

  /**
   * @state
   * @description Almacena la lista original de registros de bajas obtenida de la API.
   * @type {[Array<object>, Function]}
   */
  const [bajas, setBajas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha_desc");

  /**
   * @description `useEffect` que se dispara cada vez que `activeTab` cambia.
   * Es responsable de llamar a la API para obtener los datos correspondientes a la pestaña seleccionada.
   */
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
          setBajas(response.data.decomissions || []);
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

  /**
   * @const {Array<object>} processedData
   * @description Memoriza la lista de datos procesada (filtrada y ordenada) usando `useMemo`.
   * Selecciona la fuente de datos correcta (logs o bajas) y aplica la lógica de búsqueda y ordenación.
   * Se recalcula solo si los datos brutos, la pestaña, el término de búsqueda o la ordenación cambian.
   */
  const processedData = useMemo(() => {
    const data = activeTab === "logs" ? logs : bajas;

    return [...data]
      .filter((item) => {
        // Lógica de búsqueda flexible que funciona para ambos tipos de datos.
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
        // Lógica de ordenación que maneja fechas y texto.
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

  // Devuelve el estado y las funciones que el componente de la UI necesitará.
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
