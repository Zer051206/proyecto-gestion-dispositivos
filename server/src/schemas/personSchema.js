/**
 * @file personSchemas.js
 * @module personSchemas
 * @description Esquemas de validación Zod para la tabla 'personas'.
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} personSchema
 * @description Esquema de validación para la creación de un registro en la tabla personas.
 */
export const personSchema = z.object({
  nombre_persona: z
    .string({
      required_error: "El nombre es obligatorio.",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120),

  apellido_persona: z
    .string({
      required_error: "El apellido es obligatorio.",
    })
    .min(2, "El apellido debe tener al menos 2 caracteres.")
    .max(120),

  // FKs para Catálogos
  id_tipo_identificacion: z
    .number({
      required_error: "El tipo de identificación es obligatorio.",
    })
    .int()
    .positive("Tipo de identificación inválido."),

  id_ciudad: z
    .number({
      required_error: "La ciudad es obligatoria.",
    })
    .int()
    .positive("Ciudad inválida."),

  id_sede: z
    .number({
      required_error: "La sede es obligatoria.",
    })
    .int()
    .positive("Sede inválida."),

  id_area: z
    .number({
      required_error: "El área es obligatoria.",
    })
    .int()
    .positive("Área inválida."),

  identificacion: z
    .string({
      required_error: "La identificación es obligatoria.",
    })
    .min(5, "La identificación es requerida.")
    .max(20, "Identificación muy larga."),

  telefono: z
    .string({
      required_error: "El teléfono es obligatorio.",
    })
    .min(5, "El teléfono es requerido.")
    .max(20, "Teléfono muy largo."),
});

export const updatePersonSchema = personSchema.partial();
