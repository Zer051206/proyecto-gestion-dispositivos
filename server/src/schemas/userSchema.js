/**
 * @file userSchema.js
 * @module Schemas
 * @description Define los esquemas de validación de datos para la entidad 'Usuario' utilizando Zod.
 * Estos esquemas aseguran la integridad de los datos para las operaciones de login, creación y actualización de usuarios.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodEnum} RoleEnum
 * @description Define un tipo enumerado para los roles de usuario permitidos ('Admin', 'Encargado').
 * Incluye un mapa de errores personalizado para mensajes de validación claros.
 */
const RoleEnum = z.enum(["Admin", "Encargado"], {
  errorMap: () => ({
    message: "Rol inválido. Debe ser 'Admin' o 'Encargado'.",
  }),
});

/**
 * @const {z.ZodObject} userObjectSchema
 * @description Esquema de Zod para validar un único objeto de usuario.
 * Define el tipo de dato y las restricciones para cada propiedad de un usuario.
 * Este es el esquema base para la creación y actualización.
 */
export const userObjectSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  apellido: z
    .string()
    .trim()
    .min(2, "El apellido es obligatorio.")
    .optional()
    .nullable(),
  correo: z.string().email("El correo no es válido."),
  id_tipo_identificacion: z.coerce
    .number()
    .positive("Debe seleccionar un tipo de ID."),
  identificacion: z.coerce
    .string()
    .trim()
    .min(5, "La identificación es obligatoria."),
  telefono: z.coerce
    .string()
    .trim()
    .min(7, "El teléfono es obligatorio.")
    .optional()
    .nullable(),
  rol: RoleEnum, // El admin debe especificar qué tipo de usuario está creando
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  id_centro_operacion: z.coerce.number().optional().nullable(),
  es_ti: z.boolean().default(false).optional(),
  es_rh: z.boolean().default(false).optional(),
});

/**
 * @const {z.ZodObject} loginSchema
 * @description Esquema de validación específico para el formulario de inicio de sesión.
 * Solo valida los campos 'correo' y 'password'.
 * Utilizado en la ruta `POST /auth/login`.
 */
export const loginSchema = z.object({
  correo: z.string().email("El formato del correo no es válido."),
  password: z.string().min(1, "La contraseña no puede estar vacía."),
});

/**
 * @const {z.ZodArray} createUserSchema
 * @description Esquema para la creación de usuarios. Espera un array que contenga
 * al menos un objeto de usuario válido según `userObjectSchema`.
 * Utilizado en la ruta `POST /api/usuarios`.
 */
export const createUserSchema = z
  .array(userObjectSchema)
  .min(1, "Debes agregar al menos un usuario");

/**
 * @const {z.ZodObject} updateUserSchema
 * @description Esquema para la actualización de un usuario. Utiliza `.partial()`
 * para hacer que todos los campos del `userObjectSchema` sean opcionales.
 * Esto permite actualizaciones parciales (peticiones PATCH).
 * Utilizado en la ruta `PATCH /api/usuarios/:id`.
 */
export const updateUserSchema = userObjectSchema.partial();
