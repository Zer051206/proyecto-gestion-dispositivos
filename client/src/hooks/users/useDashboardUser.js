import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";

/**
 * Hook personalizado para gestionar los datos y el estado del dashboard de usuarios.
 * Se encarga de obtener los usuarios, filtrarlos y ordenarlos.
 */
export const useDashboardUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros y la ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre_asc"); // Valor de ordenación por defecto

  /**
   * Función para obtener la lista de usuarios desde la API.
   * Se envuelve en useCallback para memorizarla y evitar recreaciones innecesarias.
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/usuarios");
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

  // useEffect para ejecutar la carga de datos inicial cuando el componente se monta.
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Memoriza la lista de usuarios procesada (filtrada y ordenada).
   * Esta lógica solo se re-ejecuta si los usuarios, el término de búsqueda o la ordenación cambian.
   */
  const processedUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        // Lógica de filtrado por término de búsqueda
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
        // Lógica de ordenación
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

  // Devuelve el estado y las funciones que el componente necesitará
  return {
    users: processedUsers,
    isLoading,
    error,
    refetch: fetchUsers, // Para recargar los datos manualmente si es necesario
    setSearchTerm,
    setSortBy,
  };
};
