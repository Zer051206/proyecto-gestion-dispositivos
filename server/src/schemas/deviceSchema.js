/**
 * @file deviceSchemas.js
 * @module deviceSchemas
 * @description Esquemas de validación Zod para la tabla 'dispositivos'.
 */
import { z } from "zod";

// Estados disponibles en la DB: ENUM('Activo', 'En mantenimiento', 'Baja')
const DeviceStateEnum = z.enum(["Activo", "En mantenimiento", "Baja"], {
  errorMap: () => ({
    message:
      "Estado de dispositivo inválido. Use 'Activo', 'En mantenimiento' o 'Baja'.",
  }),
});

/**
 * @const {z.ZodObject} deviceSchema
 * @description Esquema de validación para la creación de un registro en la tabla dispositivos.
 */
export const deviceSchema = z.object({
  marca_dispositivo: z
    .string({
      required_error: "La marca del dispositivo es obligatoria.",
    })
    .min(2, "La marca es requerida.")
    .max(120),

  serial: z
    .string({
      required_error: "El serial es obligatorio.",
    })
    .min(5, "El serial es requerido.")
    .max(120, "Serial muy largo."),

  // FK para Catálogo
  id_tipo_dispositivo: z
    .number({
      required_error: "El tipo de dispositivo es obligatorio.",
    })
    .int()
    .positive("Tipo de dispositivo inválido."),

  // El estado es opcional ya que tiene un DEFAULT en la DB ('Activo')
  estado: DeviceStateEnum.optional().default("Activo"),
});

export const updateDeviceSchema = deviceSchema.partial();
