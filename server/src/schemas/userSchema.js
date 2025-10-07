import { z } from "zod";

/**
 * @const {z.ZodObject} createUserSchema
 * @description Esquema para validar los datos al crear un nuevo Usuario (encargado).
 */
export const createUserSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120),

  apellido: z
    .string({ required_error: "El apellido es obligatorio." })
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres.")
    .max(120),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .trim()
    .email("El correo electrónico no es válido.")
    .max(150),

  id_tipo_identificacion: z.coerce // 'coerce' convierte el string de un form a número
    .number({ required_error: "El tipo de identificación es obligatorio." })
    .int()
    .positive("Debe seleccionar un tipo de identificación."),

  identificacion: z
    .string({ required_error: "El número de identificación es obligatorio." })
    .trim()
    .min(5, "La identificación debe tener al menos 5 caracteres.")
    .max(20),

  telefono: z
    .string({ required_error: "El teléfono es obligatorio." })
    .trim()
    .min(7, "El número de teléfono no es válido.")
    .max(20),

  id_centro_operacion: z.coerce
    .number({ required_error: "El centro de operación es obligatorio." })
    .int()
    .positive("Debe asignar un centro de operación."),

  activo: z.boolean().optional(), // El admin puede decidir si crearlo activo o no

  // NOTA IMPORTANTE: El campo 'id_admin' NO se incluye aquí.
  // ¿Por qué? Porque no es un dato que el admin deba enviar en el formulario.
  // El 'id_admin' se obtendrá del token de autenticación del admin que está realizando la acción.
  // La capa de servicio se encargará de añadirlo antes de guardarlo en la base de datos.
});

/**
 * @const {z.ZodObject} updateUserSchema
 * @description Esquema para validar los datos al actualizar un Usuario.
 * Usamos .partial() para hacer que todos los campos del esquema de creación sean opcionales.
 */
export const updateUserSchema = createUserSchema.partial();
