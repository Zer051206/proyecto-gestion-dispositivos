/**
 * @file useModalLinkDevices.js
 * @module Hooks/Requerimientos
 * @description Hook personalizado para gestionar el estado y la lógica de vinculación
 * de activos (Equipos/Periféricos) a un requerimiento específico.
 */
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/axios.js";

// Constantes para identificar las pestañas
const TAB_EQUIPOS = "equipos";
const TAB_PERIFERICOS = "perifericos";

/**
 * @function useModalLinkDevices
 * @description Proporciona el estado y las funciones necesarias para el modal de alistamiento de activos.
 * @param {object} req - Objeto del requerimiento completo, incluyendo 'TechnicalAnalysis'.
 * @returns {object} Estado y funciones para el modal.
 */
export const useModalLinkDevices = (req) => {
  const {
    id_requerimiento: idRequerimiento,
    TechnicalAnalysis: analisis = {},
  } = req;

  const equiposNecesarios = analisis.cantidad_equipos > 0;
  const perifericosNecesarios = analisis.cantidad_perifericos > 0;

  const [assetsStatus, setAssetsStatus] = useState({
    requiredDevices: analisis.cantidad_equipos || 0,
    createdDevices: 0,
    requiredPeripherals: analisis.cantidad_perifericos || 0,
    createdPeripherals: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const equiposFaltantes =
    assetsStatus.requiredDevices - assetsStatus.createdDevices;
  const perifericosFaltantes =
    assetsStatus.requiredPeripherals - assetsStatus.createdPeripherals;

  const equiposCompletados = equiposFaltantes <= 0;
  const perifericosCompletados = perifericosFaltantes <= 0;

  const isAlistamientoComplete = equiposCompletados && perifericosCompletados;

  const totalTareas = useMemo(
    () => (equiposNecesarios ? 1 : 0) + (perifericosNecesarios ? 1 : 0),
    [equiposNecesarios, perifericosNecesarios]
  );

  const tareasPendientes = useMemo(
    () =>
      (equiposNecesarios && !equiposCompletados ? 1 : 0) +
      (perifericosNecesarios && !perifericosCompletados ? 1 : 0),
    [
      equiposNecesarios,
      equiposCompletados,
      perifericosNecesarios,
      perifericosCompletados,
    ]
  );

  /**
   * @async
   * @function fetchAssetsStatus
   * @description Consulta la API general para obtener el requerimiento completo,
   * y calcula el conteo de activos vinculados desde el array 'LinkedAssets'.
   */
  const fetchAssetsStatus = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/requerimientos/${idRequerimiento}`);

      const requerimientoActualizado = response.data.data;

      // 1. OBTENER LOS ACTIVOS VINCULADOS
      const linkedAssets = requerimientoActualizado.LinkedAssets || [];

      // 2. CÁLCULO CLAVE: Contamos los activos a partir del array 'LinkedAssets'
      //    Un activo es un equipo si 'id_equipo' es NO nulo.
      const createdDevicesCount = linkedAssets.filter(
        (asset) => asset.id_equipo !== null
      ).length;

      //    Un activo es un periférico si 'id_periferico' es NO nulo.
      const createdPeripheralsCount = linkedAssets.filter(
        (asset) => asset.id_periferico !== null
      ).length;

      // 3. OBTENER LOS REQUERIDOS
      const newAnalysis = requerimientoActualizado.TechnicalAnalysis || {};

      setAssetsStatus(() => ({
        requiredDevices: newAnalysis.cantidad_equipos || 0,
        requiredPeripherals: newAnalysis.cantidad_perifericos || 0,
        createdDevices: createdDevicesCount,
        createdPeripherals: createdPeripheralsCount,
      }));
    } catch (error) {
      console.error("Error al obtener el estado de activos:", error);
      toast.error("Error al cargar el progreso de alistamiento.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function handleSuccess
   * @description Maneja el éxito de la creación, fuerza la actualización y cambia de pestaña.
   */
  const handleSuccess = (type, message) => {
    toast.success(message);
    // Forzar re-fetch para actualizar los contadores
    setRefetchCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (idRequerimiento) {
      fetchAssetsStatus();
    }
  }, [idRequerimiento, refetchCounter]);

  // 💡 useEffect para establecer/cambiar la pestaña activa después de la carga
  useEffect(() => {
    if (!isLoading) {
      if (equiposNecesarios && !equiposCompletados) {
        setActiveTab(TAB_EQUIPOS);
      } else if (perifericosNecesarios && !perifericosCompletados) {
        setActiveTab(TAB_PERIFERICOS);
      } else {
        setActiveTab(null); // Nada que hacer, completado
      }
    }
  }, [
    isLoading,
    equiposNecesarios,
    equiposCompletados,
    perifericosNecesarios,
    perifericosCompletados,
  ]);

  // --- FUNCIONES DE ACCIÓN ---

  /**
   * @function handleSetActiveTab
   * @description Cambia la pestaña activa.
   */
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  /**
   * @async
   * @function handleComplete
   * @description Ejecuta el cambio de estado del requerimiento.
   */
  const handleComplete = async (onFinishAlistamiento, onClose) => {
    if (!isAlistamientoComplete) return;

    setIsSubmitting(true);
    try {
      await api.patch(
        `/api/requerimientos/${idRequerimiento}/ti-alistamiento`,
        {
          actionType: "manageTIAsset",
        }
      );

      onFinishAlistamiento(
        `Alistamiento de ${req.codigo_requerimiento} completado y estado avanzado.`
      );
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al finalizar el alistamiento.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Constantes
    TAB_EQUIPOS,
    TAB_PERIFERICOS,
    // Datos
    equiposNecesarios,
    perifericosNecesarios,
    totalTareas,
    tareasPendientes,
    // Estado
    activeTab,
    isLoading,
    isSubmitting,
    equiposCompletados,
    perifericosCompletados,
    isAlistamientoComplete,
    equiposFaltantes,
    perifericosFaltantes,
    // Acciones
    handleSetActiveTab,
    handleSuccess,
    handleComplete,
  };
};
