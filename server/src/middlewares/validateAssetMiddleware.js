/**
 * @file validateAssetSchema.js
 * @module Middleware
 * @description Middleware específico para la ruta de vinculación de activos (POST /requerimientos/:id/enlace-equipos).
 * Este middleware realiza la validación dinámica de `asset_details` basándose en el campo de control `is_equipo`.
 * @requires zod
 * @requires ../schemas/equipoSchema.js
 * @requires ../schemas/perifericoSchema.js
 */

import { z } from "zod";
import { createDeviceSchema } from "../schemas/deviceSchema.js";
import { createPeripheralSchema } from "../schemas/peripheralSchema.js";
/**
 * @function validateAssetDetails
 * @description Realiza la validación condicional de los detalles del activo (`asset_details`)
 * utilizando el esquema Zod de `Equipo` o `Periférico` según el valor del campo `is_equipo`.
 * Debe ejecutarse después de que un middleware previo haya validado la existencia y tipo de `is_equipo` y `asset_details`.
 * * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 */
export const validateAssetDetails = (req, res, next) => {
  try {
    const { is_equipo, asset_details } = req.body;

    if (typeof is_equipo !== "boolean" || !asset_details) {
      return res.status(400).json({
        message: "Faltan campos de control: 'is_equipo' o 'asset_details'.",
      });
    }

    let finalSchema;

    // 1. **Selección Dinámica del Schema**
    if (is_equipo === true) {
      // Si 'is_equipo' es true, la validación se hace con el esquema de Equipo.
      finalSchema = createDeviceSchema;
    } else {
      // Si 'is_equipo' es false, la validación se hace con el esquema de Periférico.
      finalSchema = createPeripheralSchema;
    }

    // 2. **Aplicar Parseo Final**
    // Se aplica el esquema seleccionado al objeto 'asset_details' para validar y sanear su contenido.
    // Si el parsing es exitoso, los datos saneados reemplazan el objeto original para su uso en el Service Layer.
    req.body.asset_details = finalSchema.parse(asset_details);

    next();
  } catch (error) {
    // 3. Manejo de Errores Específicos de Zod
    if (error instanceof z.ZodError) {
      // Se formatea el error para indicar que la falla ocurrió dentro del objeto 'asset_details'
      return res.status(400).json({
        status: "error",
        message:
          "Error de validación en los detalles del activo. Verifique los campos específicos de equipo/periférico.",
        errors: error.errors.map((err) => ({
          field: `asset_details.${err.path.join(".")}`, // Prefijo 'asset_details.' para claridad
          message: err.message,
        })),
      });
    }
    // Pasar otros errores (ej. errores de base de datos) al manejador de errores global
    next(error);
  }
};
