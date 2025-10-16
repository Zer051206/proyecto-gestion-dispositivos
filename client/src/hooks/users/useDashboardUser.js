/**
 * @file useDashboardUser.js
 * @module Hooks/Users
 * @description Hook de React para gestionar toda la lógica de datos de la página de gestión de usuarios.
 * Se encarga de obtener la lista de usuarios desde la API, manejar los estados de carga y error,
 * y aplicar la lógica de filtrado por búsqueda y ordenación en el lado del cliente.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

/**
 * @function useDashboardUser
 * @description Hook personalizado que encapsula la lógica para el dashboard de usuarios.
 * @returns {object} Un objeto que contiene:
 * - `users` {Array<object>}: La lista de usuarios ya filtrada y ordenada.
 * - `isLoading` {boolean}: Verdadero si los datos se están cargando.
 * - `error` {string|null}: Un mensaje de error si la petición a la API falla.
 * - `refetch` {Function}: Una función para volver a ejecutar la carga de datos.
 * - `setSearchTerm` {Function}: Función para actualizar el término de búsqueda.
 * - `setSortBy` {Function}: Función para actualizar el criterio de ordenación.
 */
export const useDashboardUser = () => {
  /**
   * @const {Array<object>} users
   * @description Estado que almacena la lista original de usuarios obtenida de la API.
   */
  const [users, setUsers] = useState([]);

  /**
   * @const {boolean} isLoading
   * @description Estado para controlar la visualización de indicadores de carga.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @const {string|null} error
   * @description Estado para almacenar mensajes de error de la API.
   */
  const [error, setError] = useState(null);

  // Estados para los filtros y la ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre_asc"); // Valor de ordenación por defecto

  /**
   * @function fetchUsers
   * @description Función asíncrona para obtener la lista de usuarios desde el endpoint `/api/usuarios`.
   * Se envuelve en `useCallback` para memorizarla y evitar recreaciones en cada renderizado,
   * optimizando el rendimiento.
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/usuarios");
      // Se asegura de que 'users' siempre sea un array, incluso si la API no devuelve nada.
      setUsers(response.data.users || []);
    } catch (err) {
      setError(
        "Error al cargar los usuarios. Por favor, intenta recargar la página."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para ejecutar la carga de datos inicial cuando el componente se monta por primera vez.
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * @const {Array<object>} processedUsers
   * @description Deriva y memoriza la lista de usuarios procesada (filtrada y ordenada) usando `useMemo`.
   * Esta lógica solo se re-ejecuta si la lista original de `users`, el `searchTerm` o el `sortBy` cambian,
   * evitando cálculos innecesarios en cada renderizado.
   */
  const processedUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        // Lógica de filtrado por término de búsqueda en varios campos.
        const term = searchTerm.toLowerCase();
        if (!term) return true; // Si no hay búsqueda, devuelve todos

        const nombreCompleto = `${user.nombre} ${
          user.apellido || ""
        }`.toLowerCase();
        const identificacion = (user.identificacion || "").toLowerCase();
        const correo = (user.correo || "").toLowerCase();

        return (
          nombreCompleto.includes(term) ||
          identificacion.includes(term) ||
          correo.includes(term)
        );
      })
      .sort((a, b) => {
        // Lógica de ordenación basada en el valor de 'sortBy'.
        const [field, order] = sortBy.split("_");

        let valA, valB;

        // Lógica especial para ordenar por centro de operación
        if (field === "centro") {
          valA = a.OperationCenter?.codigo || 0;
          valB = b.OperationCenter?.codigo || 0;
        } else {
          valA = a[field] || "";
          valB = b[field] || "";
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, sortBy]);

  // Devuelve el estado y las funciones que el componente de la vista necesitará.
  return {
    users: processedUsers,
    isLoading,
    error,
    refetch: fetchUsers, // Para recargar los datos manualmente si es necesario
    setSearchTerm,
    setSortBy,
  };
};
