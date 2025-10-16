/**
 * @file useDashboardOperationCenter.js
 * @module Hooks/OperationCenters
 * @description Hook personalizado para gestionar los datos y el estado de la UI del dashboard de Centros de Operación.
 * Se encarga de obtener la lista de centros desde la API, y de manejar la lógica de
 * búsqueda (filtrado) y ordenación del lado del cliente.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

/**
 * @function useDashboardOperationCenter
 * @description Hook de React que encapsula toda la lógica para la página de gestión de Centros de Operación.
 * Obtiene los datos, gestiona los estados de carga y error, y proporciona funciones para filtrar y ordenar la lista.
 * @returns {{
 * centers: Array<object>,
 * isLoading: boolean,
 * error: string|null,
 * refetch: Function,
 * setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
 * setSortBy: React.Dispatch<React.SetStateAction<string>>
 * }} Un objeto que contiene los centros de operación procesados, el estado de carga, errores, y las funciones para actualizar los filtros y recargar los datos.
 */
export const useDashboardOperationCenter = () => {
  /**
   * @state
   * @description Almacena la lista original de centros de operación obtenida de la API.
   * @type {[Array<object>, Function]}
   */
  const [centers, setCenters] = useState([]);

  /**
   * @state
   * @description Indica si se está realizando una petición a la API.
   * @type {[boolean, Function]}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @state
   * @description Almacena un mensaje de error si la petición a la API falla.
   * @type {[string|null, Function]}
   */
  const [error, setError] = useState(null);

  // --- Estados para los filtros y la ordenación ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("codigo_asc");

  /**
   * @function fetchCenters
   * @description Obtiene la lista completa de centros de operación desde el endpoint `/api/centros-operacion`.
   * Se envuelve en `useCallback` para memorizar la función y evitar recreaciones innecesarias,
   * optimizando su uso en `useEffect`.
   * @async
   */
  const fetchCenters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/centros-operacion");
      // Se extrae el array 'operationCenters' de la respuesta, con un fallback a un array vacío.
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

  // useEffect para ejecutar la carga de datos inicial cuando el componente se monta.
  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  /**
   * @const {Array<object>} processedCenters
   * @description Memoriza la lista de centros procesada (filtrada y ordenada) usando `useMemo`.
   * Esta lógica solo se re-ejecuta si la lista original de `centers`, el `searchTerm` o el `sortBy` cambian,
   * optimizando el rendimiento al evitar recalcular en cada render.
   */
  const processedCenters = useMemo(() => {
    return [...centers]
      .filter((center) => {
        // Lógica de filtrado por término de búsqueda en varios campos.
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
        // Lógica de ordenación basada en el valor de 'sortBy'.
        const [field, order] = sortBy.split("_");
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [centers, searchTerm, sortBy]);

  // Devuelve el estado y las funciones que el componente de la UI necesitará.
  return {
    centers: processedCenters,
    isLoading,
    error,
    refetch: fetchCenters,
    setSearchTerm,
    setSortBy,
  };
};
