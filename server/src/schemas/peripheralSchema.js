// src/schemas/peripheralSchema.js
import { z } from "zod";

export const peripheralObjectSchema = z.object({
  id_tipo_periferico: z.coerce
    .number({ required_error: "El tipo de periférico es obligatorio." })
    .int()
    .positive(),

  id_centro_operacion: z.coerce
    .number()
    .int()
    .nullable(),

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
});

export const createPeripheralSchema = z
  .array(peripheralObjectSchema)
  .min(1, "Debes agregar al menos un periferico");

export const updatePeripheralSchema = peripheralObjectSchema.partial();
