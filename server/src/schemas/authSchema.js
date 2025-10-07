import { z } from "zod";

/**
 * @const {z.ZodObject} registerAdminSchema
 * @description Esquema de validación para el registro de nuevos Administradores.
 */
export const registerAdminSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .trim()
    .email("El correo electrónico no es válido.")
    .max(180),

  id_tipo_identificacion: z.coerce
    .number({ required_error: "El tipo de identificación es obligatorio." })
    .int()
    .positive("Debe seleccionar un tipo de identificación."),

  identificacion: z
    .string({ required_error: "El número de identificación es obligatorio." })
    .trim()
    .min(5, "La identificación debe tener al menos 5 caracteres.")
    .max(20),

  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

/**
 * @const {z.ZodObject} loginSchema
 * @description Esquema de validación para el inicio de sesión de Administradores.
 */
export const loginSchema = z.object({
  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido."),

  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(1, "La contraseña no puede estar vacía."),
});
