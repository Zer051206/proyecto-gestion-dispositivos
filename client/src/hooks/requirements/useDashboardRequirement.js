/**
 * @file useDashboardRequirement.js
 * @module hooks/requirements
 * @description Hook personalizado para manejar la lógica de datos, búsqueda, filtrado y ordenamiento
 * del Dashboard de Requerimientos.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

const STATUS_TRANSLATION_MAP = {
  PENDIENTE_TI_ANALISIS: "Pendiente: Análisis de TI",
  PENDIENTE_RH_PAGO: "Pendiente: Aprobación de Pago (RH)",
  PENDIENTE_TI_ALISTAMIENTO: "Pendiente: Alistamiento de TI",
  PENDIENTE_RH_ENTREGA: "Pendiente: Entrega (RH)",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  RECHAZADO_TI: "Rechazado por TI",
  RECHAZADO_RH: "Rechazado por RH",
};

/**
 * @function useDashboardRequirement
 * @description Gestiona la obtención, filtro y ordenamiento de los requerimientos.
 * @returns {object} Estado y funciones de gestión para el Dashboard de Requerimientos.
 */
export function useDashboardRequirement() {
  const [status, setStatus] = useState([]);
  const [allRequirements, setAllRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado local para controlar qué modal está abierto
  const [modal, setModal] = useState({ type: null, data: null });

  // 2. Estados de control (búsqueda, filtro, fecha y ordenamiento)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha_desc"); // Usa 'fecha' para fecha_solicitud
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [filterDateRange, setFilterDateRange] = useState({
    start: null,
    end: null,
  });

  // 3. Obtención de estados únicos para el filtro
  const availableStatuses = useMemo(() => {
    // Mapeamos el array de estados del catálogo para obtener los nombres amigables
    const statusNames = status.map(
      (s) => STATUS_TRANSLATION_MAP[s.nombre_estado] || s.nombre_estado
    );
    return [...statusNames];
  }, [status]);

  // 4. Función de obtención de datos (Fetch)
  const fetchRequirements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reqsResponse, statusResponse] = await Promise.all([
        api.get("/api/requerimientos"), // Requerimientos
        api.get("/api/catalogo/estados-requerimientos"), // Catálogo de Estados
      ]);

      setAllRequirements(reqsResponse.data?.data || []);
      const statusArray = statusResponse.data?.data || [];
      setStatus(statusArray);
    } catch (err) {
      console.error("Error fetching requirements or statuses:", err);
      setError(
        "No se pudieron cargar los datos. Verifica tu conexión o permisos."
      );
      toast.error("Error al cargar datos del dashboard.");
      setAllRequirements([]);
      setStatus([]); // Limpiar estados si hay error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 5. Ejecutar la obtención de datos al montar el componente
  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const executeRequirementAction = useCallback(
    async (actionType, requerimiento, reason = null) => {
      const id = requerimiento?.id_requerimiento;
      if (!id) {
        toast.error("Requerimiento inválido para esta acción.");
        return false;
      }

      let url = "";
      let successMessage = "";
      const body = {}; // Inicializamos el body

      // Mapeo de URL y mensaje de éxito
      switch (actionType) {
        case "signRHPago":
          url = `/api/requerimientos/${id}/rh-pago`;
          successMessage =
            "¡Pago RH Aprobado! Requerimiento en Alistamiento TI.";
          break;

        case "manageTIAsset":
          url = `/api/requerimientos/${id}/ti-alistamiento`;
          successMessage = "¡Alistamiento TI Finalizado! Pasa a Entrega RH.";
          break;

        case "signRHEntrega":
          url = `/api/requerimientos/${id}/rh-entrega`;
          successMessage = "¡Entrega Final RH Firmada! Requerimiento cerrado.";
          break;

        case "reject":
          // Ruta para Cancelar/Rechazar
          url = `/api/requerimientos/${id}/cancelar`;
          successMessage = "Requerimiento Rechazado/Cancelado exitosamente.";

          if (reason) {
            body.razon_rechazo = reason;
          } else {
            toast.error("El motivo del rechazo es obligatorio.");
            return false;
          }
          break;

        default:
          console.error(`Acción no implementada: ${actionType}`);
          return false;
      }

      try {
        await api.patch(url, Object.keys(body).length > 0 ? body : undefined);

        toast.success(successMessage);
        fetchRequirements();
        return true;
      } catch (err) {
        console.error(`Error al ejecutar la acción ${actionType}:`, err);
        const errorMessage =
          err.response?.data?.message ||
          `Error al procesar la acción ${actionType}.`;
        toast.error(errorMessage);
        return false;
      }
    },
    [fetchRequirements]
  );

  /**
   * @const {Array<object>} requirements
   * @description Deriva y memoriza la lista de requerimientos procesada (filtrada y ordenada) usando `useMemo`.
   * Se aplica la lógica de filtrado y luego la de ordenamiento en una cadena de métodos.
   */
  const requirements = useMemo(() => {
    return (
      [...allRequirements]
        .filter((req) => {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();

          // 1. Filtrado por Estado
          const passesStatusFilter =
            filterStatus === "TODOS" ||
            req.Status?.nombre_estado === filterStatus;
          if (!passesStatusFilter) return false;

          // 2. Filtrado por Rango de Fechas
          if (filterDateRange.start && filterDateRange.end) {
            const start = new Date(filterDateRange.start);
            const end = new Date(filterDateRange.end);
            end.setHours(23, 59, 59, 999);
            const reqDate = new Date(req.fecha_solicitud);
            if (!(reqDate >= start && reqDate <= end)) return false;
          }

          // 3. Búsqueda por Término
          if (lowerCaseSearchTerm) {
            const matchesSearchTerm =
              (req.codigo_requerimiento || "")
                .toLowerCase()
                .includes(lowerCaseSearchTerm) ||
              (req.asunto || "").toLowerCase().includes(lowerCaseSearchTerm) ||
              (req.CenterOfOperation?.codigo || "")
                .toLowerCase()
                .includes(lowerCaseSearchTerm);
            if (!matchesSearchTerm) return false;
          }

          return true; // Pasa todos los filtros
        })
        // --- Lógica de Ordenamiento (sort) ---
        .sort((a, b) => {
          const [field, direction] = sortBy.split("_");
          let comparison = 0;

          // Ordenamiento por Fecha (fecha_solicitud)
          if (field === "fecha") {
            const dateA = new Date(a.fecha_solicitud || 0);
            const dateB = new Date(b.fecha_solicitud || 0);
            comparison = dateA - dateB;
          }
          // Ordenamiento por Código de Requerimiento
          else if (field === "codigo") {
            const codeA = (a.codigo_requerimiento || "").toLowerCase();
            const codeB = (b.codigo_requerimiento || "").toLowerCase();
            comparison = codeA.localeCompare(codeB);
          }
          // Ordenamiento por Nombre de Estado
          else if (field === "estado") {
            const statusA = (a.Status?.nombre_estado || "").toLowerCase();
            const statusB = (b.Status?.nombre_estado || "").toLowerCase();
            comparison = statusA.localeCompare(statusB);
          }

          // Aplicar dirección (desc: inverso, asc: directo)
          return direction === "desc" ? comparison * -1 : comparison;
        })
    );
  }, [allRequirements, filterStatus, searchTerm, sortBy, filterDateRange]);

  const handleSortClick = useCallback(
    (field) => {
      // Definimos qué campos son ordenables aquí
      const sortableFields = ["codigo", "fecha", "estado"];
      if (!sortableFields.includes(field)) return;

      const [currentField, currentDirection] = sortBy.split("_");
      let newDirection = "desc";

      if (currentField === field) {
        newDirection = currentDirection === "desc" ? "asc" : "desc";
      }
      setSortBy(`${field}_${newDirection}`);
    },
    [sortBy]
  );

  const handleAction = (type, req = null) => {
    const confirmationActions = [
      "signRHPago",
      "manageTIAsset",
      "signRHEntrega",
      "reject",
    ];

    if (confirmationActions.includes(type)) {
      // Para las acciones que van al ConfirmationModalWrapper
      setModal({
        type: "confirmation", // El tipo de modal que se va a renderizar
        data: {
          req: req,
          actionType: type, // El tipo de acción real a ejecutar
        },
      });
    } else {
      // Para los otros modales (details, createRequirement, signTIAnalysis)
      setModal({ type, data: req });
    }
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
    fetchRequirements();
  };

  const handleSuccess = (message) => {
    closeModal();
  };

  // 7. Retorno del hook
  return {
    status,
    requirements,
    isLoading,
    error,
    fetchRequirements,
    setSearchTerm,
    setSortBy,
    setFilterStatus,
    setFilterDateRange,
    handleSuccess,
    handleAction,
    searchTerm,
    sortBy,
    filterStatus,
    filterDateRange,
    availableStatuses,
    modal,
    closeModal,
    handleSortClick,
    executeRequirementAction,
  };
}
