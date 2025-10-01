/**
 * @file assignmentSchemas.js
 * @module assignmentSchemas
 * @description Esquemas de validación Zod para la tabla 'asignaciones', Este archivo actualmente no será usar debido
 * a que no es realmente necesario, pero mas adelante servirá para poder escalar la aplicacion facilmente,
 * por esta razon se deja integrado.
 */
import { z } from "zod";

// Función utilitaria para validar fechas ISO 8601 (o formato MySQL DATETIME)
const dateSchema = z
  .string({
    required_error: "La fecha es requerida.",
    invalid_type_error:
      "El formato de fecha debe ser una cadena de texto (ISO 8601).",
  })
  .refine((val) => !isNaN(new Date(val).getTime()), {
    message: "El formato de fecha y hora (datetime) es inválido o no ISO 8601.",
  });

/**
 * @const {z.ZodObject} assignmentSchema
 * @description Esquema de validación para la creación o actualización de asignaciones.
 * NOTA: Este esquema completo se usaría si el FE enviara todos los campos.
 */
export const assignmentSchema = z.object({
  id_persona: z.number().int().positive("ID de persona inválido."),
  id_dispositivo: z.number().int().positive("ID de dispositivo inválido."),

  // Si la fecha la genera el servidor, este campo es opcional en la validación Zod
  // Si se envía, debe ser un formato de fecha válido (ISO 8601).
  fecha_asignacion: dateSchema.optional(),

  fecha_devolucion: dateSchema.nullable().optional().default(null),
});
