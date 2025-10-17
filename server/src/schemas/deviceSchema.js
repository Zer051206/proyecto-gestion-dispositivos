/**
 * @file deviceSchema.js
 * @module Schemas
 * @description Define los esquemas de validación de datos para la entidad 'Equipo' utilizando Zod.
 * Estos esquemas se utilizan en los controladores para validar los datos de las peticiones HTTP
 * antes de que lleguen a la capa de servicio, asegurando la integridad de los datos.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} deviceObjectSchema
 * @description Esquema de Zod para validar un único objeto de equipo.
 * Define el tipo de dato, las restricciones (ej. `min`, `max`) y si los campos son
 * opcionales o nulos para cada propiedad de un equipo.
 */
export const deviceObjectSchema = z.object({
  id_centro_operacion: z.coerce.number().int().nullable(),

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
  empresa_alquila: z.string().max(180).optional().nullable(),
  estado_equipo: z.boolean({
    required_error: "El estado del equipo es obligatorio.",
  }),
  activo_fijo: z.boolean({
    required_error: "Debe indicar si es un activo fijo.",
  }),
  codigo_activo_fijo: z.string().max(80).optional().nullable(),
  id_centro_costo: z.string().optional().nullable(),
});

/**
 * @const {z.ZodArray} createDeviceSchema
 * @description Esquema para la creación de equipos. Espera un array que contenga
 * al menos un objeto de equipo válido según `deviceObjectSchema`.
 * Utilizado en la ruta `POST /api/dispositivos`.
 */
export const createDeviceSchema = z
  .array(deviceObjectSchema)
  .min(1, "Debes agregar al menos un equipo");

/**
 * @const {z.ZodObject} updateDeviceSchema
 * @description Esquema para la actualización de un equipo. Utiliza `.partial()`
 * para hacer que todos los campos del `deviceObjectSchema` sean opcionales.
 * Esto permite actualizaciones parciales (peticiones PATCH) donde solo se envían los campos a modificar.
 * Utilizado en la ruta `PATCH /api/dispositivos/:id`.
 */
export const updateDeviceSchema = deviceObjectSchema.partial();
