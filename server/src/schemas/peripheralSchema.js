// src/schemas/peripheralSchema.js
import { z } from "zod";

/**
 * @const {z.ZodObject} createPeripheralSchema
 * @description Esquema para validar los datos al crear un nuevo periférico.
 */
export const createPeripheralSchema = z.object({
  id_tipo_periferico: z.coerce
    .number({ required_error: "El tipo de periférico es obligatorio." })
    .int()
    .positive(),

  id_centro_operacion: z.coerce
    .number({ required_error: "El centro de operación es obligatorio." })
    .int()
    .positive(),

  marca_periferico: z
    .string({ required_error: "La marca es obligatoria." })
    .min(1)
    .max(150),

  serial_periferico: z
    .string({ required_error: "El serial es obligatorio." })
    .min(1)
    .max(200),

  periferico_etiquetado: z.boolean({
    required_error: "Debe indicar si el periférico está etiquetado.",
  }),

  etiqueta_periferico: z.string().max(120).optional().nullable(),
});

/**
 * @const {z.ZodObject} updatePeripheralSchema
 * @description Esquema para validar los datos al actualizar un periférico. Todos los campos son opcionales.
 */
export const updatePeripheralSchema = createPeripheralSchema.partial();
