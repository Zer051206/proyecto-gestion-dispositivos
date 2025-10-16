/**
 * @file create-hash.js
 * @module Utils
 * @description Script de utilidad de línea de comandos para generar un hash de contraseña seguro utilizando bcrypt.
 * Este script es una herramienta de desarrollo para crear manualmente contraseñas hasheadas que pueden ser
 * insertadas directamente en la base de datos, especialmente para la creación del primer usuario administrador.
 * @requires bcrypt
 * @requires process
 * @usage node create-hash.js <tu-contraseña-aqui>
 * @example node create-hash.js supersecretpassword123
 */
import bcrypt from "bcrypt";
import { exit } from "process";

// --- 1. Lectura del Argumento de la Línea de Comandos ---

/**
 * @const {string} password
 * @description La contraseña en texto plano proporcionada como un argumento al ejecutar el script.
 * `process.argv[2]` captura el primer argumento después del nombre del script (ej. 'node create-hash.js mi_contraseña').
 */
const password = process.argv[2];

// Valida si se proporcionó una contraseña. Si no, muestra un error y las instrucciones de uso.
if (!password) {
  console.error("Error: Debes proporcionar una contraseña.");
  console.log("Uso: node create-hash.js <tu-contraseña-aqui>");
  exit(1); // Termina el script con un código de error.
}

// --- 2. Configuración de Bcrypt ---

/**
 * @const {number} saltRounds
 * @description El "costo" o factor de trabajo para el algoritmo de hashing.
 * Un número más alto hace que el hash sea más seguro contra ataques de fuerza bruta,
 * pero también más lento de generar. 10 es un valor estándar y seguro.
 */
const saltRounds = 10;

// --- 3. Generación del Hash ---

/**
 * @function bcrypt.hash
 * @description Función principal de bcrypt que toma la contraseña en texto plano y genera un hash.
 * La función es asíncrona y utiliza un callback para manejar el resultado.
 * @param {string} password - La contraseña a hashear.
 * @param {number} saltRounds - El costo del hashing.
 * @param {Function} callback - Función que se ejecuta al finalizar, recibiendo un error (si lo hay) y el hash generado.
 */
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error al generar el hash:", err);
    return;
  }
  // Si el hashing es exitoso, imprime el resultado en la consola.
  console.log(`\nLa contraseña '${password}' se ha hasheado exitosamente.\n`);
  console.log("Copia y pega el siguiente hash en tu base de datos:");
  console.log(hash);
});
