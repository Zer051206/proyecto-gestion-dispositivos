import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

export const initialCenterCostValues = {
  codigo_centro_costo: "",
  centro_costo: "",
  id_centro_operacion: "",
};

export const useCreateCenterCostForm = (onSuccess) => {
  const formik = useFormik({
    initialValues: {
      centerCosts: [initialCenterCostValues],
    },
    validationSchema: Yup.object({
      centerCosts: Yup.array().of(
        Yup.object({
          codigo_centro_costo: Yup.string()
            .trim()
            .required("El código es obligatorio"),
          centro_costo: Yup.string()
            .trim()
            .required("El nombre es obligatorio"),
          id_centro_operacion: Yup.number()
            .positive("Seleccione un C.O.")
            .required("El centro de operación es obligatorio"),
        })
      ).min(1, "Debe agregar al menos un centro de costo."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        // Enviamos el array directamente al endpoint
        await api.post("/api/centros-costo", values.centerCosts);
        
        toast.success(`¡${values.centerCosts.length} centro(s) de costo creado(s)!`);
        resetForm();
        if (onSuccess) onSuccess();
      } catch (err) {
        const msg = err.response?.data?.message || "Error al crear centros de costo";
        setFieldError("apiError", msg);
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};