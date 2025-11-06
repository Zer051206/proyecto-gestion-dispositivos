/**
 * @file globalSchemas.js
 * @module Schemas
 * @description Define esquemas de validación de datos genéricos y reutilizables
 * que se aplican a través de múltiples entidades (ej. validación de ID de ruta, paginación).
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} IDParamSchema
 * @description Esquema para validar IDs de recursos que vienen en los parámetros de la URL (`req.params`).
 * Asegura que el valor de 'id' sea convertible a un entero positivo.
 * Utilizado en todas las rutas que dependen de un ID (`GET /:id`, `PATCH /:id/...`, etc.).
 */
export const IDParamSchema = z.object({
  /**
   * @property {number} id - El identificador único del recurso (ej. Requerimiento ID).
   * Usa `.coerce.number()` para intentar convertir la cadena de la URL en número.
   */
  id: z.coerce
    .number({
      invalid_type_error: "El ID del requerimiento debe ser un número.",
    })
    .int({
      message: "El ID debe ser un número entero (sin decimales).",
    })
    .positive({
      message: "El ID debe ser un número positivo.",
    }),
});
