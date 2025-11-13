/**
 * @file validateAssetSchema.js
 * @module Middlewares
 * @description Middleware para validar dinámicamente el esquema de los detalles de activos (`asset_details`).
 * Utiliza Zod para verificar que cada objeto dentro del arreglo `asset_details` cumpla con el esquema
 * correspondiente (equipo o periférico), basándose en el valor booleano de `is_equipo`.
 * @requires z
 * @requires ../schemas/deviceSchema.js
 * @requires ../schemas/peripheralSchema.js
 */
import { z } from "zod";
import { deviceObjectSchema } from "../schemas/deviceSchema.js";
import { peripheralObjectSchema } from "../schemas/peripheralSchema.js";

/**
 * @function validateAssetDetails
 * @description Middleware de Express que valida los detalles de los activos en el cuerpo de la solicitud (`req.body`).
 * Elige el esquema de validación (`createDeviceSchema` o `createPeripheralSchema`) basándose en `req.body.is_equipo`.
 * Luego, aplica el esquema seleccionado a cada elemento del arreglo `req.body.asset_details`.
 * Si la validación es exitosa, sanitiza y adjunta el arreglo validado a `req.body.asset_details`.
 * @param {object} req - El objeto de la solicitud de Express, se espera que contenga `is_equipo` (boolean) y `asset_details` (array).
 * @param {object} res - El objeto de la respuesta de Express.
 * @param {Function} next - La función callback para pasar el control al siguiente middleware.
 * @returns {void} Llama a `next()` para continuar si la validación es exitosa, o devuelve una respuesta de error (400) si falla la validación de Zod o los campos de control.
 */
export const validateAssetDetails = (req, res, next) => {
  try {
    const { is_equipo, asset_details } = req.body;

    if (typeof is_equipo !== "boolean" || !Array.isArray(asset_details)) {
      return res.status(400).json({
        message:
          "Faltan campos de control: 'is_equipo' (boolean) o 'asset_details' debe ser un arreglo.",
      });
    }

    let finalSchema;

    // 1. Selección Dinámica del Schema (Define el esquema para UN activo)
    if (is_equipo === true) {
      finalSchema = deviceObjectSchema;
    } else {
      finalSchema = peripheralObjectSchema;
    }

    // 2. Aplicar validación a CADA activo y sanear el array (Uso de Zod.array)
    const finalArraySchema = z.array(finalSchema);

    // El parseo final valida todo el arreglo contra el esquema seleccionado
    req.body.asset_details = finalArraySchema.parse(asset_details);

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("🚀 ~ validateAssetDetails ~ error:", error);
      return res.status(400).json({
        status: "error",
        message:
          "Error de validación en los detalles del activo. Verifique los campos específicos de equipo/periférico en el arreglo.",
        errors: error.errors.map((err) => ({
          field: `asset_details[${err.path[0]}].${err.path.slice(1).join(".")}`,
          message: err.message,
        })),
      });
    }
    next(error);
  }
};
