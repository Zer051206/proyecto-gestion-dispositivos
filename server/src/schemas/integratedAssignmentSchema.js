/**
 * @file integratedAssignmentSchema.js
 * @module integratedAssignmentSchema
 * @description Esquema compuesto Zod para validar la entrada del formulario único
 * que crea una Persona, crea un Dispositivo y realiza la Asignación en una sola transacción.
 */
import { z } from "zod";
import { personSchema } from "./personSchemas.js";
import { deviceSchema } from "./deviceSchemas.js";

// ----------------------------------------------------------------------
// Esquema Integrado
// ----------------------------------------------------------------------

/**
 * @const {z.ZodObject} integratedAssignmentSchema
 * @description Esquema principal que combina la validación de todos los datos necesarios
 * para crear un nuevo empleado y un nuevo dispositivo.
 * * El campo assignmentDetails se deja vacío o se elimina si no se necesita ninguna data
 * adicional del frontend para la asignación. Lo eliminamos para simplicidad.
 */
export const integratedAssignmentSchema = z.object({
  // 1. Datos de la persona (Crear nuevo registro en 'personas')
  personData: personSchema,

  // 2. Datos del dispositivo (Crear nuevo registro en 'dispositivos')
  deviceData: deviceSchema,

  //* NOTA: En caso de escalar la aplicacion y cambiar el funcionamiento del formulario principal,
  //* puedes agrgar mas schemas aca.
});
