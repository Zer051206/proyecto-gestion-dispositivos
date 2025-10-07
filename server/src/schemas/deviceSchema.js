// src/schemas/deviceSchema.js
import { z } from "zod";

/**
 * @const {z.ZodObject} createDeviceSchema
 * @description Esquema para validar los datos al crear un nuevo dispositivo/equipo.
 */
export const createDeviceSchema = z.object({
  id_centro_operacion: z.coerce
    .number({ required_error: "El centro de operación es obligatorio." })
    .int()
    .positive(),

  serial: z.string({ required_error: "El serial es obligatorio." }).max(255),

  equipo_laptop: z.boolean({
    required_error: "Debe indicar si es laptop o no.",
  }),

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
});

/**
 * @const {z.ZodObject} updateDeviceSchema
 * @description Esquema para validar los datos al actualizar un dispositivo. Todos los campos son opcionales.
 */
export const updateDeviceSchema = createDeviceSchema.partial();
