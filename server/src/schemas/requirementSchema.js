/**
 * @file requirementSchema.js
 * @module Schemas
 * @description Define los esquemas de validación de datos para el flujo de 'Requerimientos'
 * (creación, análisis técnico y vinculación de activos) utilizando Zod.
 * @requires zod
 */
import { z } from "zod";

// ==========================================================
// 1. REQUERIMIENTO (CREACIÓN) - Tabla 'requerimientos'
// ==========================================================

/**
 * @const {z.ZodObject} CreateRequirementSchema
 * @description Esquema para validar los datos necesarios al crear un nuevo Requerimiento.
 * Utilizado en la ruta `POST /requerimientos`.
 */
export const CreateRequirementSchema = z.object({
  /**
   * @property {string} asunto - Breve descripción de la necesidad. Obligatorio, 5-255 caracteres.
   */
  asunto: z
    .string({
      required_error: "El 'asunto' es obligatorio.",
    })
    .min(5, "El asunto debe tener al menos 5 caracteres.")
    .max(255, "Máximo 255 caracteres."),

  /**
   * @property {string} detalle_necesidad - Solicitud detallada del Centro de Operación (CO). Obligatorio, mínimo 10 caracteres.
   */
  detalle_necesidad: z
    .string({
      required_error: "El 'detalle_necesidad' es obligatorio.",
    })
    .min(
      10,
      "El detalle de la necesidad debe ser descriptivo (mínimo 10 caracteres)."
    ),

  /**
   * @property {number|null} presupuesto_estimado - Presupuesto inicial opcional. Debe ser positivo.
   */
  presupuesto_estimado: z.number().positive().nullable().optional(),
});

/**
 * @const {z.ZodObject} UpdateRequirementSchema
 * @description Esquema para la actualización parcial de los campos del Requerimiento.
 * Es la versión `.partial()` del `CreateRequirementSchema`.
 * Esto permite que cualquier campo se envíe de forma opcional en un PATCH.
 */
export const UpdateRequirementSchema = CreateRequirementSchema.partial();

// ==========================================================
// 2. ANÁLISIS TÉCNICO (FIRMA TI) - Tabla 'analisis_tecnico'
// ==========================================================

/**
 * @const {z.ZodObject} SignTIAnalysisSchema
 * @description Esquema para validar los datos que componen el Análisis Técnico de TI.
 * Utilizado en la ruta `PATCH /requerimientos/:id/analisis-ti`.
 */
export const SignTIAnalysisSchema = z.object({
  /**
   * @property {string} descripcion_solucion - Descripción detallada de la solución técnica propuesta. Obligatoria, mínimo 20 caracteres.
   */
  descripcion_solucion: z
    .string({
      required_error: "La descripción de la solución es obligatoria.",
    })
    .min(
      20,
      "La descripción de la solución debe ser detallada (mínimo 20 caracteres)."
    ),

  /**
   * @property {number} cantidad_equipos - Número de equipos (laptops/desktops) requeridos. Entero no negativo.
   */
  cantidad_equipos: z
    .number({
      required_error: "La cantidad de equipos es obligatoria.",
    })
    .int("Debe ser un número entero.")
    .min(0, "No puede ser un valor negativo."),

  /**
   * @property {number} cantidad_perifericos - Número de periféricos requeridos. Entero no negativo.
   */
  cantidad_perifericos: z
    .number({
      required_error: "La cantidad de periféricos es obligatoria.",
    })
    .int("Debe ser un número entero.")
    .min(0, "No puede ser un valor negativo."),

  /**
   * @property {number} presupuesto_final - El costo total final del análisis. Obligatorio, positivo.
   * El `.transform` asegura el formato DECIMAL(10, 2).
   */
  presupuesto_final: z
    .number({
      required_error: "El presupuesto final es obligatorio.",
    })
    .positive("El presupuesto debe ser un valor positivo (mayor que cero).")
    .transform((val) => parseFloat(val.toFixed(2))),
});

// ==========================================================
// 3. VINCULACIÓN DE ACTIVO - TABLA 'requerimiento_activos'
// ==========================================================

/**
 * @const {z.ZodObject} CreateAndLinkAssetControlSchema
 * @description Esquema simplificado. Valida solo los campos de control (`is_equipo`)
 * y acepta `asset_details` como un objeto genérico, Su contenido
 * será validado por los schemas de `Equipo` o `Periferico` existentes en el Service Layer.
 * Utilizado en la ruta `POST /requerimientos/:id/enlace-equipos`.
 */
export const CreateAndLinkAssetControlSchema = z.object({
  /**
   * @property {boolean} is_equipo - Indicador de tipo de activo a crear (true=Equipo, false=Periférico).
   * Es crucial para que el Service Layer sepa qué modelo usar.
   */
  is_equipo: z.boolean({
    required_error:
      "Debe especificar si el activo es 'is_equipo' (true/false).",
  }),

  /**
   * @property {object} asset_details - Objeto que contiene todos los campos de creación
   * del Equipo o Periférico. La validación del *contenido* se hace en otro archivo.
   */
  asset_details: z.object({}).passthrough(), // Usamos passthrough para aceptar cualquier campo aquí
});
