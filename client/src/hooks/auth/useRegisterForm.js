// src/hooks/auth/useRegisterForm.js

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("El nombre es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120),
  apellido: Yup.string()
    .required("El apellido es obligatorio.")
    .min(2, "El apellido debe tener al menos 2 caracteres.")
    .max(120),
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio.")
    .max(150),
  id_tipo_identificacion: Yup.number()
    .required("El tipo de identificación es obligatorio.")
    .positive("Selecciona un tipo de identificación válido."),
  identificacion: Yup.string()
    .required("El número de identificación es obligatorio.")
    .min(5, "La identificación debe tener al menos 5 caracteres.")
    .max(20),
  telefono: Yup.string()
    .required("El teléfono es obligatorio.")
    .min(7, "El número de teléfono no es válido.")
    .max(20),
  rol: Yup.string()
    .oneOf(["Inventario", "Admin"], "El rol seleccionado no es válido.")
    .required("El rol es obligatorio."),
  password: Yup.string()
    .required("La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Debes confirmar la contraseña."),
});

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposIdRes] = await Promise.all([
          api.get("/api/catalogo/tipos-identificacion"),
        ]);
        setTiposIdentificacion(tiposIdRes.data);
      } catch (error) {
        setError(
          "Hubo un error al cargar las opciones. Por favor, intente recargar la página."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      correo: "",
      id_tipo_identificacion: "", // Inicializamos todos los campos
      identificacion: "",
      telefono: "",
      rol: "Inventario", // Podemos poner un valor por defecto
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError, resetForm }) => {
      try {
        // No necesitamos enviar 'confirmPassword' a la API
        const { confirmPassword, ...userData } = values;

        await api.post("/auth/register", userData);

        // En lugar de un alert, podemos redirigir con un mensaje de éxito
        navigate("/auth/login", {
          state: {
            successMessage: "¡Registro exitoso! Ahora puedes iniciar sesión.",
          },
        });

        resetForm();
      } catch (err) {
        // Primero, comprobamos si la respuesta del error tiene el array 'errors' de Zod/Sequelize
        if (err.response?.data?.errors) {
          // Si es así, recorremos el array
          err.response.data.errors.forEach((error) => {
            // Y usamos setFieldError para asignar cada mensaje de error a su campo correspondiente
            setFieldError(error.path, error.message);
          });
        } else {
          // Si no hay un array, es un error general (como "credenciales incorrectas")
          // Lo asignamos al campo 'apiError' que ya tienes
          const errorMessage =
            err.response?.data?.message || "Ha ocurrido un error inesperado.";
          setFieldError("apiError", errorMessage);
        }
      }
    },
  });

  return {
    formik,
    tiposIdentificacion,
    isLoading,
    error,
  };
};
