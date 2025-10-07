/**
 * @file usePasswordToggle.js
 * @module Hooks
 * @description Hook personalizado para gestionar la visibilidad de la contraseña en un campo de entrada.
 * Alterna el tipo de input entre 'password' y 'text' y el icono de visibilidad
 * para permitir al usuario ver u ocultar el texto que está escribiendo.
 * @requires react/useState
 * @requires react-icons/fa/FaRegEye, FaRegEyeSlash
 */
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

/**
 * @function usePasswordToggle
 * @description Proporciona el estado y las funciones para alternar la visibilidad de un campo de contraseña.
 *
 * @returns {Array} Un array que contiene tres elementos desestructurables en el componente:
 * 1. {string} inputType - El tipo actual del input ('password' o 'text').
 * 2. {React.Component} Icon - El componente de icono a mostrar (ojo abierto o cerrado).
 * 3. {Function} toggleVisibility - Función para cambiar el estado de visibilidad.
 */
export const usePasswordToggle = () => {
  /**
   * @const {boolean} showPassword
   * @description Estado que indica si la contraseña debe mostrarse (true) u ocultarse (false).
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  /**
   * @function toggleVisibility
   * @description Alterna el estado de `showPassword`, cambiando la visibilidad del campo.
   * @returns {void}
   */
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVisibilityConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  /**
   * @const {React.Component} Icon
   * @description Selecciona el icono a mostrar: ojo cerrado (`FaRegEye`) si la contraseña está oculta,
   * o ojo abierto (`FaRegEyeSlash`) si está visible.
   */
  const Icon = showPassword ? FaRegEyeSlash : FaRegEye;
  const IconConfirm = showPasswordConfirm ? FaRegEyeSlash : FaRegEye;

  /**
   * @const {string} inputType
   * @description Determina el atributo `type` del campo de entrada: 'text' si visible, 'password' si oculto.
   */
  const inputType = showPassword ? "text" : "password";
  const inputTypeConfirm = showPasswordConfirm ? "text" : "password";

  // Se devuelve un array para facilitar la desestructuración en el componente que lo consume.
  return [
    inputType,
    Icon,
    toggleVisibility,
    inputTypeConfirm,
    IconConfirm,
    toggleVisibilityConfirm,
  ];
};
