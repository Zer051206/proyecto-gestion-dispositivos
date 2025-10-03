/**
 * @file useRegisterForm.js
 * @module Hooks
 * @description Hook personalizado que maneja el estado del formulario de registro,
 * la comunicación con la API para crear un nuevo usuario y la navegación posterior.
 *
 * Utiliza el cliente base de Axios y la utilidad para restringir la entrada de texto.
 * @requires react/useState
 * @requires ../../axiosClient
 * @requires react-router-dom/useNavigate
 * @requires ../utils/inputUtilities
 */
import { useState } from "react";
import axiosClient from "../../axiosClient.js";
import { useNavigate } from "react-router-dom";
import { handleKeyTextDown } from "../../utils/inputUtilities.js";

/**
 * @function useRegisterForm
 * @description Hook para gestionar el formulario de registro de nuevos usuarios.
 * Mantiene el estado de los campos de entrada y maneja la lógica de envío del formulario.
 *
 * @returns {object} Un objeto que contiene el estado de los campos, el manejador de envío y las funciones de actualización.
 *
 * @property {string} nombre - Estado actual del campo nombre.
 * @property {string} apellido - Estado actual del campo apellido.
 * @property {string} correo - Estado actual del campo correo electrónico.
 * @property {string} password - Estado actual del campo contraseña.
 * @property {Function} handleRegister - Función asíncrona que maneja el envío del formulario a la API.
 * @property {Function} handleClickNombre - Manejador de cambio para el input nombre.
 * @property {Function} handleClickApellido - Manejador de cambio para el input apellido.
 * @property {Function} handleClickCorreo - Manejador de cambio para el input correo.
 * @property {Function} handleClickPassword - Manejador de cambio para el input contraseña.
 * @property {string} error - Mensaje de error a mostrar al usuario, si la petición falla.
 * @property {boolean} isLoading - Indicador de estado de carga (si la petición está en curso).
 * @property {Function} handleKeyTextDown - Utilidad de control de entrada de texto (importada).
 */
export function useRegisterForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickNombre = (e) => setNombre(e.target.value);
  const handleClickApellido = (e) => setApellido(e.target.value);
  const handleClickCorreo = (e) => setCorreo(e.target.value);
  const handleClickPassword = (e) => setPassword(e.target.value);

  /**
   * @async
   * @description Función que se ejecuta al enviar el formulario.
   * Envía los datos del nuevo usuario al endpoint de registro.
   * Si tiene éxito, redirige al usuario a la página de login.
   * @param {Event} e - El evento del formulario (utilizado para prevenir el comportamiento por defecto).
   * @returns {void}
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Limpiar errores anteriores

    try {
      await axiosClient.post("/auth/register", {
        nombre,
        correo,
        apellido,
        password,
      });
      alert(
        "Usuario creado exitósamente, será enviado al formulario de inicio de sesión"
      );
      navigate("/auth/login");
    } catch (err) {
      // Manejo de errores de respuesta de la API
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrarse. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nombre,
    correo,
    password,
    apellido,
    handleRegister,
    handleClickNombre,
    handleClickCorreo,
    handleClickApellido,
    handleClickPassword,
    error,
    isLoading,
    handleKeyTextDown,
  };
}
