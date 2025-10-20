/**
 * @file useCatalogs.js
 * @module Hooks/Catalogue
 * @description Hook personalizado para obtener y gestionar los datos de los catálogos de la aplicación.
 * Este hook centraliza la lógica de `fetch` para múltiples catálogos (ej. tipos de identificación,
 * centros de operación), que son necesarios para poblar los menús `<select>` en varios formularios.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect } from "react";
import api from "../../config/axios.js";

/**
 * @function useCatalogs
 * @description Hook de React que encapsula la lógica para obtener los principales catálogos de la aplicación.
 * Realiza múltiples peticiones a la API en paralelo para optimizar los tiempos de carga.
 * @returns {{
 * tiposIdentificacion: Array<object>,
 * centrosOperacion: Array<object>,
 * isLoading: boolean,
 * error: string|null
 * }} Un objeto que contiene los arrays de datos de los catálogos, el estado de carga y cualquier error que haya ocurrido.
 */
export const useCatalogs = () => {
  /**
   * @state
   * @description Almacena los datos de los catálogos en un solo objeto para facilitar su manejo.
   */
  const [data, setData] = useState({
    tiposIdentificacion: [],
    centrosOperacion: [],
  });

  /**
   * @state {boolean} isLoading
   * @description Indica si las peticiones a la API para los catálogos están en curso.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @state
   * @description Almacena un mensaje de error si alguna de las peticiones a la API falla.
   * @type {Array}
   */
  const [error, setError] = useState(null);

  /**
   * @description `useEffect` que se ejecuta una sola vez al montar el componente que usa este hook.
   * Se encarga de llamar a las APIs de los catálogos en paralelo.
   */
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        // Usamos Promise.all para ejecutar ambas peticiones de forma concurrente,
        // lo que reduce el tiempo de espera total.
        const [tiposIdRes, centrosOpRes] = await Promise.all([
          api.get("/api/catalogos/tipos-identificacion"),
          api.get("/api/centros-operacion"),
        ]);
        setData({
          // Extraemos los datos de cada respuesta, asegurando un array vacío como fallback.
          tiposIdentificacion: tiposIdRes.data,
          centrosOperacion: centrosOpRes.data,
        });
      } catch (err) {
        setError("Error al cargar los catálogos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalogs();
  }, []); // El array de dependencias vacío asegura que el efecto se ejecute solo una vez.

  // Devuelve los datos de los catálogos, junto con los estados de carga y error.
  return { ...data, isLoading, error };
};
