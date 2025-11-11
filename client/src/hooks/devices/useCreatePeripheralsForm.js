/**
 * @file useCreatePeripheralsForm.js
 * @module Hooks/Devices
 * @description Hook personalizado para gestionar la lógica del formulario dinámico de creación de periféricos.
 * Este hook encapsula la validación con Yup (incluyendo reglas condicionales basadas en el rol del usuario),
 * el estado del formulario con Formik y la lógica de envío de datos a la API.
 * @requires formik
 * @requires yup
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js
 */
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {Yup.ObjectSchema} peripheralValidationSchema
 * @description Esquema base de validación de Yup para UN SOLO objeto de periférico.
 * No incluye la validación de `id_centro_operacion`, ya que esta es condicional y se añade dinámicamente.
 */
const peripheralValidationSchema = Yup.object({
  serial_periferico: Yup.string().required("El serial es obligatorio."),
  marca_periferico: Yup.string().required("La marca es obligatoria."),
  activo_fijo: Yup.boolean().required("Debes indicar si es un activo fijo."),
  codigo_activo_fijo: Yup.string().when("activo_fijo", {
    is: true,
    then: (schema) => schema.trim(),
  }),
  id_tipo_periferico: Yup.number()
    .positive("Debe seleccionar un tipo de periférico.")
    .required("El tipo de periférico es obligatorio."),
  // La validación del centro de operación se hará en el hook principal
});

/**
 * @const {object} initialPeripheralValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de periférico en blanco.
 */
export const initialPeripheralValues = {
  serial_periferico: "",
  marca_periferico: "",
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_tipo_periferico: "",
  id_centro_operacion: "",
  estado_periferico: true,
  has_cost_center: false,
  id_centro_costo: "",
};

/**
 * @function useCreatePeripheralsForm
 * @description Hook de React que proporciona toda la lógica y el estado para un formulario de creación de múltiples periféricos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa.
 * @returns {object} La instancia completa de Formik.
 */
export const useCreatePeripheralsForm = (onSuccess, idRequerimiento = null) => {
  // Obtenemos el usuario logueado para aplicar validaciones condicionales.
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";

  const [coIdFromReq, setCoIdFromReq] = useState(null);
  const [requiredCount, setRequiredCount] = useState(null);
  const [isLoadingCo, setIsLoadingCo] = useState(idRequerimiento !== null);

  /**
   * @const {Yup.ObjectSchema} finalValidationSchema
   * @description Esquema de validación final y dinámico.
   * Toma el esquema base y le añade la regla para `id_centro_operacion` solo si el usuario es Admin.
   */
  const finalValidationSchema = peripheralValidationSchema.shape({
    id_centro_operacion: isAdmin
      ? Yup.number()
          .positive("Debe seleccionar un centro.")
          .required("El centro es obligatorio.")
      : Yup.string().notRequired(), // Para Encargados, este campo no se valida en el frontend.

    has_cost_center: Yup.boolean(),
    id_centro_operacion: Yup.number().when(
      ["$idRequerimiento", "$coIdFromReq"],
      {
        // Solo se valida si NO estamos en el flujo de requerimiento (idRequerimiento es null)
        is: (reqId) => reqId === null,
        then: (schema) =>
          isAdmin
            ? schema
                .positive("Debe seleccionar un centro de operación.")
                .required("El centro de operación es obligatorio.")
            : schema.notRequired(),
        // Si es un requerimiento (reqId !== null), NUNCA se requiere validación manual.
        otherwise: (schema) => schema.notRequired(),
      }
    ),
  });

  let peripheralsArrayValidation = Yup.array()
    .of(finalValidationSchema)
    .min(1, "Debes agregar al menos un periférico.");

  // Se aplica el límite estricto si se cargó desde el requerimiento
  if (requiredCount !== null && idRequerimiento) {
    peripheralsArrayValidation = peripheralsArrayValidation
      .min(
        requiredCount,
        `Debes registrar exactamente ${requiredCount} periférico(s) según el análisis.`
      )
      .max(
        requiredCount,
        `Solo se permiten ${requiredCount} periférico(s) según el análisis.`
      );
  }

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik` que maneja todo el estado del formulario.
   */
  const formik = useFormik({
    // Inicializa el array con el tamaño del límite, o con 1 si no hay límite
    initialValues: {
      peripherals: Array.from({ length: requiredCount || 1 }, () => ({
        ...initialPeripheralValues,
        id_centro_operacion:
          !isAdmin && !idRequerimiento ? user.id_centro_operacion : "",
      })),
    },
    validationContext: {
      idRequerimiento: idRequerimiento,
      coIdFromReq: coIdFromReq, // Pasar el valor al contexto de Yup
    },
    validationSchema: Yup.object({ peripherals: peripheralsArrayValidation }), // <-- Usar la validación dinámica
    onSubmit: () => {}, // placeholder, se define abajo
  });

  useEffect(() => {
    if (idRequerimiento) {
      const fetchReqData = async () => {
        try {
          const response = await api.get(
            `/api/requerimientos/${idRequerimiento}`
          );
          const { id_centro_operacion, analisis_tecnico } = response.data;

          // Nota: Asumo que tienes un campo similar para cantidad de periféricos
          const requiredLimit = analisis_tecnico?.cantidad_perifericos || 0;

          if (id_centro_operacion) {
            setCoIdFromReq(id_centro_operacion);
            setRequiredCount(requiredLimit); // Establecer el límite

            // Ajustamos los valores y la cantidad del FieldArray
            formik.setValues((currentValues) => {
              const basePeripheral = {
                ...initialPeripheralValues,
                id_centro_operacion: id_centro_operacion,
              };

              // 2. Usar los valores existentes o llenar hasta el límite
              const initialPeripherals = Array.from(
                { length: requiredLimit },
                (_, index) => {
                  return index < currentValues.peripherals.length
                    ? {
                        ...currentValues.peripherals[index],
                        id_centro_operacion: id_centro_operacion,
                      }
                    : basePeripheral;
                }
              );

              return { peripherals: initialPeripherals };
            }, false);
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

  /**
   * @function onSubmit
   * @description Función que se ejecuta al enviar el formulario si la validación es exitosa.
   * @param {object} values - Los valores actuales del formulario.
   * @param {object} formikHelpers - Objeto con helpers de Formik.
   */
  formik.onSubmit = async (values, { setFieldError, setSubmitting }) => {
    if (isLoadingCo) {
      setFieldError(
        "apiError",
        "Aún cargando datos del requerimiento, por favor espere."
      );
      setSubmitting(false);
      return;
    }

    try {
      let endpoint = "/api/perifericos";
      let payload = values.peripherals;

      if (idRequerimiento) {
        endpoint = `/api/requerimientos/${idRequerimiento}/enlace-dispositivos`;

        payload = payload.map((p) => ({
          ...p,
          id_centro_operacion: coIdFromReq,
        }));
      }

      await api.post(endpoint, payload);

      if (onSuccess) {
        onSuccess(
          `¡${values.peripherals.length} periférico(s) creado(s) exitosamente!`
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Ocurrió un error al crear los periféricos.";
      setFieldError("apiError", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Devolvemos formik y los nuevos estados de control.
  return { formik, requiredCount, isLoadingCo };
};
