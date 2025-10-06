/**
 * @file authSchemas.js
 * @module authSchemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones
 * de autenticación de usuarios: registro, inicio de sesión (login) y autenticación
 * a través de OAuth.
 */
import { z } from "zod";

const RoleEnum = z.enum(["Inventario", "Admin"], {
  errorMap: () => ({
    message: "Rol inválido. Debe ser 'Inventario' o 'Admin'.",
  }),
});

/**
 * @const {z.ZodObject} registerSchema
 * @description Esquema de validación para el registro de nuevos usuarios.
 */

export const registerSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(120),

  apellido: z
    .string({ required_error: "El apellido es obligatorio." })
    .trim()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .max(120),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .trim()
    .email({ message: "El correo electrónico no es válido." })
    .max(150),

  id_tipo_identificacion: z
    .number({
      required_error: "El tipo de identificación es obligatorio.",
      invalid_type_error: "El tipo de identificación debe ser un número (ID).",
    })
    .int()
    .positive({ message: "El ID del tipo de identificación no es válido." }),

  identificacion: z
    .string({ required_error: "El número de identificación es obligatorio." })
    .trim()
    .min(5, { message: "La identificación debe tener al menos 5 caracteres." })
    .max(20),

  telefono: z
    .string({ required_error: "El teléfono es obligatorio." })
    .trim()
    .min(7, { message: "El número de teléfono no es válido." })
    .max(20),

  rol: RoleEnum, // Usamos el ENUM que definimos arriba

  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

/**
 * @const {z.ZodObject} loginSchema
 * @description Esquema de validación para el inicio de sesión (login) de usuarios.
 */
export const loginSchema = z.object({
  correo: z
    .string({
      required_error: "El correo es obligatorio.",
      invalid_type_error: "El correo debe ser una cadena de texto.",
    })
    .trim()
    .email({ message: "El correo electronico no es válido." }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .min(8, { message: "La contraseña debe tener al menos 8 carácteres" }),
});

/**
 * @const {z.ZodEffects} oauthSchema
 * @description Esquema de validación para los datos recibidos de un proveedor OAuth (Google/Microsoft).
 */
export const oauthSchema = z
  .object({
    email: z.string().email(),
    given_name: z.string().optional(), // De Google
    family_name: z.string().optional(), // De Google
    firstName: z.string().optional(), // De Microsoft
    lastName: z.string().optional(), // De Microsoft
    id_oauth: z.string(),
    proveedor_oauth: z.enum(["google", "microsoft"]),
  })
  .transform((data) => {
    return {
      correo: data.email,
      nombre: data.given_name || data.firstName || null,
      apellido: data.family_name || data.lastName || null,
      id_oauth: data.id_oauth,
      proveedor_oauth: data.proveedor_oauth,
    };
  });
