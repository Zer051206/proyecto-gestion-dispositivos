/**
 * @file useDashboardDevice.js
 * @module Hooks/Devices
 * @description Hook personalizado para gestionar los datos y el estado de la UI del dashboard de Dispositivos (Equipos y Periféricos).
 * Se encarga de obtener la lista combinada de dispositivos desde la API, y de manejar la lógica de
 * búsqueda (filtrado) y filtrado por estado del lado del cliente.
 * @requires react
 * @requires ../config/axios.js
 * @requires ../stores/authStore.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

/**
 * @function useDashboardDevice
 * @description Hook de React que encapsula toda la lógica para la página de gestión de dispositivos.
 * Obtiene los datos, gestiona los estados de carga y error, y proporciona funciones para filtrar la lista.
 * @returns {{
 * assets: Array<object>,
 * isLoading: boolean,
 * error: string|null,
 * refetch: Function,
 * setSearchTerm: {Function},
 * setFilterStatus: {Function}
 * }} Un objeto que contiene los dispositivos procesados, el estado de carga, errores, y las funciones para actualizar los filtros y recargar los datos.
 */
export const useDashboardDevice = () => {
  /**
   * @state
   * @description Almacena la lista original de dispositivos (equipos y periféricos) obtenida de la API.
   * @type {Array}
   */
  const [originalAssets, setOriginalAssets] = useState([]);

  /**
   * @state {boolean} isLoading
   * @description Indica si se está realizando una petición a la API.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @state
   * @description Almacena un mensaje de error si la petición a la API falla.
   * @type {Array}
   */
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  /**
   * @function fetchAssets
   * @description Obtiene la lista combinada de dispositivos desde el endpoint `/api/activos`.
   * El backend se encarga de filtrar por rol. Se envuelve en `useCallback` para memorización.
   * @async
   */
  const fetchAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/activos");
      setOriginalAssets(response.data.assets || []);
    } catch (err) {
      setError("Error al cargar los activos. Intenta recargar la página.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect para ejecutar la carga de datos inicial cuando el componente se monta.
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  /**
   * @const {Array<object>} filteredAssets
   * @description Memoriza la lista de dispositivos procesada (filtrada) usando `useMemo`.
   * Se recalcula solo si los activos originales, el término de búsqueda o el filtro de estado cambian,
   * optimizando el rendimiento.
   */
  const filteredAssets = useMemo(() => {
    return originalAssets
      .filter((asset) => {
        if (filterStatus === "activos")
          return asset.estado_equipo || asset.estado_periferico;
        if (filterStatus === "baja")
          return !(asset.estado_equipo || asset.estado_periferico);
        return true;
      })
      .filter((asset) => {
        // Lógica de filtrado por término de búsqueda en serial o etiqueta
        const term = searchTerm.toLowerCase();
        const serial = asset.serial || asset.serial_periferico || "";
        const tipo_periferico = asset.tipo_periferico || "";
        return serial.toLowerCase().includes(term) || tipo_periferico.toLowerCase().includes(term);
      });
  }, [originalAssets, searchTerm, filterStatus]);

  // Devuelve el estado y las funciones que el componente de la UI necesitará
  return {
    originalAssets,
    filteredAssets,
    isLoading,
    error,
    refetch: fetchAssets,
    setSearchTerm,
    setFilterStatus,
  };
};
