// src/schemas/operationCenterSchema.js
import { z } from "zod";

/**
 * @const {z.ZodObject} createOperationCenterSchema
 * @description Esquema para validar los datos al crear un nuevo centro de operación.
 */
export const createOperationCenterSchema = z.object({
  codigo: z.coerce
    .number({
      required_error: "El código es obligatorio.",
      invalid_type_error: "El código debe ser un número.",
    })
    .int()
    .positive("El código debe ser un número positivo."),

  id_usuario: z.coerce
    .number({
      required_error: "El ID del usuario responsable es obligatorio.",
    })
    .int()
    .positive(),

  id_ciudad: z.coerce
    .number({
      required_error: "El ID de la ciudad es obligatorio.",
    })
    .int()
    .positive(),

  direccion: z
    .string({ required_error: "La dirección es obligatoria." })
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(150),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido.")
    .max(150),
});

/**
 * @const {z.ZodObject} updateOperationCenterSchema
 * @description Esquema para validar los datos al actualizar un centro de operación. Todos los campos son opcionales.
 */
export const updateOperationCenterSchema =
  createOperationCenterSchema.partial();
