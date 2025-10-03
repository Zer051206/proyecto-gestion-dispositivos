/**
 * @file inputHandlers.js
 * @module InputHandlers
 * @description Este archivo contiene funciones de utilidad para manejar la lógica de los inputs,
 * controlando la entrada de caracteres no deseados mediante eventos de teclado.
 */

/**
 * @function handleKeyNumberDown
 * @description Función para prevenir la entrada de caracteres no numéricos o no deseados (como 'e', '+', '-', '.', ',')
 * en inputs de tipo 'number' para asegurar que solo se ingresen dígitos enteros.
 * @param {KeyboardEvent} event - El evento del teclado disparado en 'onKeyDown'.
 * @returns {void}
 */
export const handleKeyNumberDown = (event) => {
  // Array de teclas que no queremos permitir en un campo numérico básico
  const invalidKeys = ["e", "E", "+", "-", ".", ","];

  // Si la tecla presionada está en la lista de no válidas, prevenimos la acción por defecto
  if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
};

/**
 * @function handleKeyTextDown
 * @description Función que previene la entrada de números y símbolos no alfanuméricos en campos de texto, como nombres.
 * Permite letras (mayúsculas y minúsculas), tildes, la 'ñ', espacios y guiones.
 * @param {KeyboardEvent} e - El evento de teclado disparado en 'onKeyDown'.
 * @returns {void}
 */
export function handleKeyTextDown(e) {
  // Expresión regular que permite letras, la letra 'ñ', tildes, espacios y el guion.
  const allowedCharacters = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]/;

  // Permite teclas de control esenciales (Tab, Backspace, Delete, flechas, etc.)
  // Estas teclas no tienen una longitud de 1
  const isControlKey = e.key.length !== 1 || e.ctrlKey || e.altKey;

  // Verifica si la tecla NO es un caracter permitido (y NO es una tecla de control)
  if (!allowedCharacters.test(e.key) && !isControlKey) {
    e.preventDefault();
  }
}

/**
 * @function handleAddressKeyDown
 * @description Función que previene la entrada de caracteres no válidos en campos de dirección.
 * Permite letras, números, espacios, guiones, puntos, comas y el símbolo de número (#).
 * @param {KeyboardEvent} e - El evento de teclado disparado en 'onKeyDown'.
 * @returns {void}
 */
export function handleAddressKeyDown(e) {
  // Expresión regular que permite letras, números, espacios y símbolos comunes en direcciones.
  const allowedCharacters = /[a-zA-Z0-9\s.,#-]/;

  // Permite teclas de control como backspace, delete, tab, y flechas.
  // Se usa e.key.length !== 1 para simplificar la detección de teclas de control
  const isControlKey = e.key.length !== 1 || e.ctrlKey || e.altKey;

  // Si la tecla NO es un caracter permitido y NO es una tecla de control, previene la acción.
  if (!allowedCharacters.test(e.key) && !isControlKey) {
    e.preventDefault();
  }
}
