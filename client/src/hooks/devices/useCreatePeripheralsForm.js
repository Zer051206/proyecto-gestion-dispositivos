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
import { useState, useEffect, useMemo } from "react";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {object} initialPeripheralValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de periférico en blanco.
 */
export const initialPeripheralValues = {
  serial_periferico: "",
  marca_periferico: "",
  activo_fijo: false,
  codigo_activo_fijo: null,
  id_tipo_periferico: "",
  id_centro_operacion: "",
  estado_periferico: true,
  has_cost_center: false,
  id_centro_costo: "",
};

/**
 * @const {Yup.ObjectSchema} getBasePeripheralValidationSchema
 * @description Esquema base de validación de Yup para UN SOLO objeto de periférico.
 * @param {boolean} isAdmin - Indica si el usuario es administrador.
 */
const getBasePeripheralValidationSchema = (isAdmin) => {
  return Yup.object({
    serial_periferico: Yup.string().required("El serial es obligatorio."),
    marca_periferico: Yup.string().required("La marca es obligatoria."),
    activo_fijo: Yup.boolean().required("Debes indicar si es un activo fijo."),
    codigo_activo_fijo: Yup.string().when("activo_fijo", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .required("El código de activo fijo es obligatorio si aplica."),
      otherwise: (schema) => schema.nullable().transform(() => null), // Transforma '' a null
    }),
    id_tipo_periferico: Yup.number()
      .typeError("Debe ser un número.")
      .positive("Debe seleccionar un tipo de periférico.")
      .required("El tipo de periférico es obligatorio."), // Validación de Centro de Costo (Añadida)

    has_cost_center: Yup.boolean(),
    id_centro_costo: Yup.number().when("has_cost_center", {
      is: true,
      then: (schema) =>
        schema
          .positive("Debe seleccionar un centro de costo.")
          .required("El centro de costo es obligatorio."),
      otherwise: (schema) => schema.nullable().transform(() => null),
    }), // Validación condicional: Usa el contexto ($idRequerimiento)
    id_centro_operacion: Yup.number().when(["$idRequerimiento"], {
      is: (reqId) => reqId === null, // Solo se valida si NO es flujo de requerimiento
      then: (schema) =>
        isAdmin
          ? schema
              .positive("Debe seleccionar un centro de operación.")
              .required("El centro de operación es obligatorio.")
          : schema.notRequired(),
      otherwise: (schema) => schema.notRequired(), // Si es requerimiento, no se requiere validación manual.
    }),
  });
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

  const initialCount = requiredCount !== null ? requiredCount : 1;

  const validationSchema = useMemo(() => {
    let peripheralsArrayValidation = Yup.array()
      .of(getBasePeripheralValidationSchema(isAdmin))
      .min(1, "Debes agregar al menos un periférico."); // Aplicar el límite estricto

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

    return Yup.object({ peripherals: peripheralsArrayValidation });
  }, [requiredCount, idRequerimiento, isAdmin]);

  /**
   * @function handleSubmitLogic
   * @description Función que se ejecuta al enviar el formulario, solo si la validación es exitosa.
   */
  const handleSubmitLogic = async (
    values,
    { setFieldError, setSubmitting, resetForm }
  ) => {
    let endpoint = "/api/perifericos";
    let payload = values.peripherals; // 1. Bloqueo por carga

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

        const peripheralsWithCoId = values.peripherals.map((p) => ({
          ...p,
          id_centro_operacion: coIdFromReq,
        }));

        payload = {
          is_equipo: false,
          asset_details: peripheralsWithCoId,
        };
      } else {
        // Mapeo para el flujo directo (no requerimiento)
        payload = values.peripherals.map((p) => ({
          ...p,
          // Asignar el CO del usuario si es necesario y si el valor no ha sido seleccionado por el Admin
          id_centro_operacion:
            !isAdmin && !p.id_centro_operacion
              ? user.id_centro_operacion
              : p.id_centro_operacion,
        }));
      }

      await api.post(endpoint, payload);

      if (onSuccess) {
        onSuccess(
          `¡${values.peripherals.length} periférico(s) creado(s) exitosamente!`
        );
      }

      resetForm({
        values: {
          peripherals: Array.from(
            { length: initialCount },
            () => initialPeripheralValues
          ),
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Ocurrió un error al crear los periféricos.";
      setFieldError("apiError", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik`.
   */

  const formik = useFormik({
    initialValues: {
      peripherals: Array.from({ length: initialCount }, () => ({
        ...initialPeripheralValues,
        id_centro_operacion:
          !isAdmin && !idRequerimiento ? user.id_centro_operacion : "",
      })),
    },
    validationContext: {
      idRequerimiento: idRequerimiento,
      coIdFromReq: coIdFromReq,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmitLogic,
  });

  useEffect(() => {
    if (idRequerimiento) {
      const fetchReqData = async () => {
        try {
          const response = await api.get(
            `/api/requerimientos/${idRequerimiento}`
          );
          const { id_centro_operacion, TechnicalAnalysis } = response.data.data;

          const requiredLimit = TechnicalAnalysis?.cantidad_perifericos || 0;

          if (id_centro_operacion) {
            setCoIdFromReq(id_centro_operacion);
            setRequiredCount(requiredLimit);

            formik.setValues((currentValues) => {
              // 1. Crear el array con el tamaño exacto del límite (requiredLimit)
              const basePeripheral = {
                ...initialPeripheralValues,
                id_centro_operacion: id_centro_operacion,
              }; // 2. Usar los valores existentes si hay menos que el límite, o recortar

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
  }, [idRequerimiento, formik.setValues]); // Devolvemos formik y los nuevos estados de control.

  return { formik, requiredCount, isLoadingCo };
};
