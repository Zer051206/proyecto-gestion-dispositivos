/**
 * @file operationCenterSchema.js
 * @module Schemas
 * @description Define los esquemas de validación de datos para la entidad 'Centro de Operación' utilizando Zod.
 * Estos esquemas aseguran la integridad de los datos para las operaciones de creación y actualización.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} operationCenterObjectSchema
 * @description Esquema de Zod para validar un único objeto de Centro de Operación.
 * Define el tipo de dato y las restricciones para cada propiedad.
 */
export const operationCenterObjectSchema = z.object({
  codigo: z.string({ required_error: "El código es obligatorio." }),

  id_ciudad: z.coerce
    .number({ required_error: "La ciudad es obligatoria." })
    .int()
    .positive(),

  direccion: z
    .string({ required_error: "La dirección es obligatoria." })
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(150),

  telefono: z.coerce
    .string({ required_error: "El telefono es obligatorio." })
    .trim()
    .min(9, "El teleono no es válido")
    .max(15, "El telefono no es válido."),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido.")
    .max(150),
});

/**
 * @const {z.ZodArray} createOperationCenterSchema
 * @description Esquema para la creación de centros de operación. Espera un array que contenga
 * al menos un objeto de centro válido según `operationCenterObjectSchema`.
 * Utilizado en la ruta `POST /api/centros-operacion`.
 */
export const createOperationCenterSchema = z.array(operationCenterObjectSchema);

/**
 * @const {z.ZodObject} updateOperationCenterSchema
 * @description Esquema para la actualización de un centro de operación. Utiliza `.partial()`
 * para hacer que todos los campos del `operationCenterObjectSchema` sean opcionales.
 * Esto permite actualizaciones parciales (peticiones PATCH).
 * Utilizado en la ruta `PATCH /api/centros-operacion/:id`.
 */
export const updateOperationCenterSchema =
  operationCenterObjectSchema.partial();
