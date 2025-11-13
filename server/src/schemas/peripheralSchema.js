/**
 * @file peripheralSchema.js
 * @module Schemas
 * @description Define los esquemas de validación de datos para la entidad 'Periférico' utilizando Zod.
 * Estos esquemas aseguran la integridad de los datos para las operaciones de creación y actualización.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} peripheralObjectSchema
 * @description Esquema de Zod para validar un único objeto de periférico.
 * Define el tipo de dato y las restricciones para cada propiedad.
 */
export const peripheralObjectSchema = z.object({
  id_tipo_periferico: z.coerce
    .number({ required_error: "El tipo de periférico es obligatorio." })
    .int()
    .positive(),

  id_centro_operacion: z.coerce.number().int().nullable(),

  marca_periferico: z
    .string({ required_error: "La marca es obligatoria." })
    .trim()
    .min(1)
    .max(150),
  serial_periferico: z
    .string({ required_error: "El serial es obligatorio." })
    .trim()
    .min(1)
    .max(200),
  activo_fijo: z.boolean({
    required_error: "Debe indicar si es un activo fijo.",
  }),
  codigo_activo_fijo: z.string().max(80).optional().nullable(),
  id_centro_costo: z.coerce
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      // Si coerce.string() devuelve una cadena vacía o null, devolvemos null.
      // Si es un ID válido ("2"), Number(val) lo convertirá a 2 (número).
      if (val === "" || val === null) {
        return null;
      }
      // Intentamos forzar a número y si es NaN (ej: "abc") fallará la validación de Sequelize o Zod.
      const num = Number(val);
      return isNaN(num) ? val : num;
    }),
});

/**
 * @const {z.ZodArray} createPeripheralSchema
 * @description Esquema para la creación de periféricos. Espera un array que contenga
 * al menos un objeto de periférico válido según `peripheralObjectSchema`.
 * Utilizado en la ruta `POST /api/perifericos`.
 */
export const createPeripheralSchema = z
  .array(peripheralObjectSchema)
  .min(1, "Debes agregar al menos un periferico");

/**
 * @const {z.ZodObject} updatePeripheralSchema
 * @description Esquema para la actualización de un periférico. Utiliza `.partial()`
 * para hacer que todos los campos del `peripheralObjectSchema` sean opcionales.
 * Esto permite actualizaciones parciales (peticiones PATCH).
 * Utilizado en la ruta `PATCH /api/perifericos/:id`.
 */
export const updatePeripheralSchema = peripheralObjectSchema.partial();
