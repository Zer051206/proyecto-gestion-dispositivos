// src/schemas/deviceSchema.js
import { z } from "zod";

export const createDeviceSchema = z.object({
  id_centro_operacion: z.coerce
    .number({ required_error: "El centro de operación es obligatorio." })
    .int()
    .positive(),

  serial: z
    .string({ required_error: "El serial es obligatorio." })
    .trim()
    .max(255),
  equipo_laptop: z.boolean({ required_error: "Debe indicar si es laptop." }),
  tamano_disco_duro: z.coerce
    .number({ required_error: "El tamaño del disco es obligatorio." })
    .int()
    .positive(),
  equipo_tarjeta_grafica: z.boolean({
    required_error: "Debe indicar si tiene tarjeta gráfica.",
  }),
  referencia_tarjeta_grafica: z.string().max(255).optional().nullable(),
  serial_pantalla: z.string().max(255).optional().nullable(),
  equipo_alquilado: z.boolean({
    required_error: "Debe indicar si el equipo es alquilado.",
  }),
  estado_equipo: z.boolean({
    required_error: "El estado del equipo es obligatorio.",
  }),
  equipo_etiquetado: z.boolean({
    required_error: "Debe indicar si el equipo está etiquetado.",
  }),
  equipo_etiqueta: z.string().max(120).optional().nullable(),

  activo_fijo: z.boolean({
    required_error: "Debe indicar si es un activo fijo.",
  }),
  codigo_activo_fijo: z.string().max(80).optional().nullable(),
});

export const updateDeviceSchema = createDeviceSchema.partial();
