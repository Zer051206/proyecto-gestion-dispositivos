// src/schemas/peripheralSchema.js
import { z } from "zod";

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
    .trim()
    .min(1)
    .max(150),
  serial_periferico: z
    .string({ required_error: "El serial es obligatorio." })
    .trim()
    .min(1)
    .max(200),
  periferico_etiquetado: z.boolean({
    required_error: "Debe indicar si el periférico está etiquetado.",
  }),
  etiqueta_periferico: z.string().max(120).optional().nullable(),

  // --- Campos nuevos ---
  activo_fijo: z.boolean({
    required_error: "Debe indicar si es un activo fijo.",
  }),
  codigo_activo_fijo: z.string().max(80).optional().nullable(),
});

export const updatePeripheralSchema = createPeripheralSchema.partial();
