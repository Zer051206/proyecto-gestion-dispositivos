import { z } from "zod";

const RoleEnum = z.enum(["Admin", "Encargado"], {
  errorMap: () => ({
    message: "Rol inválido. Debe ser 'Admin' o 'Encargado'.",
  }),
});

export const createUserSchema = z.object({
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
  identificacion: z.string().trim().min(5, "La identificación es obligatoria."),
  telefono: z
    .string()
    .trim()
    .min(7, "El teléfono es obligatorio.")
    .optional()
    .nullable(),
  rol: RoleEnum, // El admin debe especificar qué tipo de usuario está creando
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  id_centro_operacion: z.coerce.number().positive().optional().nullable(),
});

export const loginSchema = z.object({
  correo: z.string().email("El formato del correo no es válido."),
  password: z.string().min(1, "La contraseña no puede estar vacía."),
});

export const updateUserSchema = createUserSchema.partial();
