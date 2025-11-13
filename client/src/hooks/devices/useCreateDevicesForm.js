/**
 * @file useCreateDevicesForm.js
 * @module Hooks/Devices
 * @description Hook personalizado para gestionar la lógica del formulario dinámico de creación de equipos.
 * Este hook encapsula la validación con Yup (incluyendo reglas condicionales basadas en el rol del usuario),
 * el estado del formulario con Formik y la lógica de envío de datos a la API.
 * @requires formik
 * @requires yup
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js
 */
import { useFormik } from "formik";
import { useState, useEffect, useMemo } from "react";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {object} initialDeviceValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de equipo en blanco.
 * Se utiliza para inicializar el formulario y para añadir nuevas filas en el FieldArray.
 */
export const initialDeviceValues = {
  serial: "",
  equipo_laptop: true,
  tamano_disco_duro: "",
  equipo_tarjeta_grafica: false,
  referencia_tarjeta_grafica: "",
  serial_pantalla: "",
  equipo_alquilado: false,
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_centro_operacion: "",
  has_cost_center: false,
  id_centro_costo: "",
  estado_equipo: true,
  empresa_alquila: "",
};

const getBaseDeviceValidationSchema = (isAdmin) => {
  return Yup.object({
    serial: Yup.string().required("El serial es obligatorio."),
    equipo_laptop: Yup.boolean().required(),
    tamano_disco_duro: Yup.number()
      .typeError("Debe ser un número.")
      .positive("Debe ser positivo.")
      .required("El tamaño del disco es obligatorio."),
    equipo_tarjeta_grafica: Yup.boolean().required(),
    referencia_tarjeta_grafica: Yup.string().when("equipo_tarjeta_grafica", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .required("La referencia es obligatoria si tiene tarjeta gráfica."),
    }),
    serial_pantalla: Yup.string().when("equipo_laptop", {
      is: false,
      then: (schema) =>
        schema
          .trim()
          .required(
            "El serial de la pantalla es obligatorio para PCs de escritorio."
          ),
    }),
    equipo_alquilado: Yup.boolean().required(),
    empresa_alquila: Yup.string().when("equipo_alquilado", {
      is: true,
      then: (schema) =>
        schema.required("El nombre de la empresa que alquila es obligatorio."),
      otherwise: (schema) => schema.nullable().transform(() => null),
    }),
    activo_fijo: Yup.boolean().required(),
    codigo_activo_fijo: Yup.string().trim().nullable(),

    // Validación condicional: Usa el contexto ($idRequerimiento)
    id_centro_operacion: Yup.number().when(["$idRequerimiento"], {
      is: (reqId) => reqId === null, // Solo se valida si NO es flujo de requerimiento
      then: (schema) =>
        isAdmin
          ? schema
              .positive("Debe seleccionar un centro de operación.")
              .required("El centro de operación es obligatorio.")
          : schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),

    has_cost_center: Yup.boolean(),
    id_centro_costo: Yup.number().when("has_cost_center", {
      is: true,
      then: (schema) =>
        schema
          .positive("Debe seleccionar un área.")
          .required("El centro de costo es obligatorio."),
      otherwise: (schema) => schema.nullable(),
    }),
  });
};

/**
 * @function useCreateDevicesForm
 * @description Hook de React que proporciona toda la lógica y el estado necesarios para un formulario de creación de múltiples equipos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa. Recibe un mensaje de éxito como argumento.
 * @returns {object} La instancia completa de Formik, que contiene el estado (`values`, `errors`, `isSubmitting`),
 * los manejadores de eventos (`handleSubmit`, `getFieldProps`) y otras utilidades.
 */
/**
 * @function useCreateDevicesForm
 * @description Hook de React que proporciona toda la lógica y el estado necesarios para un formulario de creación de múltiples equipos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa. Recibe un mensaje de éxito como argumento.
 * @returns {object} La instancia completa de Formik, que contiene el estado (`values`, `errors`, `isSubmitting`),
 * los manejadores de eventos (`handleSubmit`, `getFieldProps`) y otras utilidades.
 */
export const useCreateDevicesForm = (onSuccess, idRequerimiento = null) => {
  // Obtenemos el usuario logueado para aplicar validaciones condicionales.
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";

  const [coIdFromReq, setCoIdFromReq] = useState(null);
  const [requiredCount, setRequiredCount] = useState(null);
  const [isLoadingCo, setIsLoadingCo] = useState(idRequerimiento !== null);

  const initialCount = requiredCount !== null ? requiredCount : 1;

  const validationSchema = useMemo(() => {
    let devicesArrayValidation = Yup.array()
      .of(getBaseDeviceValidationSchema(isAdmin))
      .min(1, "Debes agregar al menos un equipo.");

    // Aplicar el límite estricto
    if (requiredCount !== null && idRequerimiento) {
      devicesArrayValidation = devicesArrayValidation
        .min(
          requiredCount,
          `Debes registrar exactamente ${requiredCount} equipo(s) según el análisis.`
        )
        .max(
          requiredCount,
          `Solo se permiten ${requiredCount} equipo(s) según el análisis.`
        );
    }

    return Yup.object({ devices: devicesArrayValidation });
  }, [requiredCount, idRequerimiento, isAdmin]);

  /**
   * @function handleSubmitLogic
   * @description Función que se ejecuta al enviar el formulario, solo si la validación es exitosa.
   * Envía los datos a la API y maneja las respuestas de éxito o error.
   * @param {object} values - Los valores actuales del formulario.
   * @param {object} formikHelpers - Objeto con helpers de Formik (ej. setFieldError).
   */
  const handleSubmitLogic = async (
    values,
    { setFieldError, setSubmitting, resetForm }
  ) => {
    let endpoint = "/api/dispositivos";
    let payload = values.devices;

    if (isLoadingCo) {
      setFieldError(
        "apiError",
        "Aún cargando datos del requerimiento, por favor espere."
      );
      setSubmitting(false);
      return;
    }

    try {
      if (idRequerimiento) {
        endpoint = `/api/requerimientos/${idRequerimiento}/enlace-dispositivos`;

        // Aseguramos que el COID correcto se envíe
        const devicesWithCoId = values.devices.map((d) => ({
          ...d,
          id_centro_operacion: coIdFromReq,
        }));

        payload = {
          is_equipo: true,
          asset_details: devicesWithCoId,
        };
      }

      await api.post(endpoint, payload);

      if (onSuccess) {
        onSuccess(
          `¡${values.devices.length} equipo(s) creado(s) exitosamente!`
        );
      }

      resetForm({
        values: { devices: values.devices.map(() => initialDeviceValues) },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Ocurrió un error al crear los equipos.";
      setFieldError("apiError", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik`.
   * Maneja el estado del formulario, la validación y la lógica de envío.
   */
  const formik = useFormik({
    initialValues: {
      devices: Array.from({ length: initialCount }, () => ({
        ...initialDeviceValues,
        id_centro_operacion:
          !isAdmin && !idRequerimiento ? user.id_centro_operacion : "",
      })),
    },
    validationContext: {
      idRequerimiento: idRequerimiento,
      coIdFromReq: coIdFromReq,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmitLogic, // <-- ASIGNACIÓN CORRECTA DEL SUBMIT
  });

  useEffect(() => {
    if (idRequerimiento) {
      const fetchReqData = async () => {
        try {
          const response = await api.get(
            `/api/requerimientos/${idRequerimiento}`
          );
          const { id_centro_operacion, TechnicalAnalysis } = response.data.data;

          const requiredLimit = TechnicalAnalysis?.cantidad_equipos || 0;

          if (id_centro_operacion) {
            setCoIdFromReq(id_centro_operacion);
            setRequiredCount(requiredLimit);
          }
        } catch (error) {
          console.error(
            "Error al obtener datos del requerimiento (CO y límite):",
            error
          );
        } finally {
          setIsLoadingCo(false);
        }
      };
      fetchReqData();
    }
  }, [idRequerimiento, formik.setValues]);

  return { formik, requiredCount, isLoadingCo };
};
