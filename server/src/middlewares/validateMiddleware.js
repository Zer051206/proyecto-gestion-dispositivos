/**
 * @file validateSchema.js
 * @module Middleware
 * @description Middleware genérico para validar datos de entrada (body, params, query) usando Zod.
 * Si la validación falla, retorna un error 400 Bad Request; si es exitosa, pasa los datos saneados.
 * @requires zod
 */

import { z } from "zod";

/**
 * @function validate
 * @description Crea una función middleware que valida la entrada de la petición contra un esquema Zod.
 * @param {z.ZodSchema} schema - El esquema Zod a utilizar para la validación.
 * @param {('body'|'params'|'query')} source - La fuente de datos en `req` a validar ('body' por defecto).
 * @returns {function} Un middleware de Express (req, res, next).
 */
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      // 1. Obtener la fuente de datos a validar desde la petición
      const dataToValidate = req[source];

      // 2. Aplicar el parseo de Zod. Esto valida los datos y los sanea/convierte tipos si es necesario.
      // Si tiene éxito, los datos validados se almacenan. Si falla, lanza un ZodError.
      const validatedData = schema.parse(dataToValidate);

      // 3. Reemplazar la fuente original de la petición con los datos validados y saneados.
      // Esto garantiza que el controlador solo recibe datos limpios.
      req[source] = validatedData;

      next();
    } catch (error) {
      // 4. Manejo de errores de Zod
      if (error instanceof z.ZodError) {
        // Mapeamos los errores para generar una respuesta JSON limpia y clara
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."), // Muestra la ruta del campo con error (ej. nombre, usuario.email)
          message: err.message,
        }));

        // Respuesta 400 Bad Request
        return res.status(400).json({
          status: "error",
          message: `Error de validación en los datos de ${source}.`,
          errors: formattedErrors,
        });
      }

      // 5. Si es otro tipo de error, lo pasamos al manejador de errores global
      next(error);
    }
  };
