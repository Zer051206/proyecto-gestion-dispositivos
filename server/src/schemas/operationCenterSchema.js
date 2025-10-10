// src/schemas/operationCenterSchema.js
import { z } from "zod";

export const operationCenterObjectSchema = z.object({
  codigo: z.coerce
    .number({ required_error: "El código es obligatorio." })
    .int()
    .positive(),

  id_ciudad: z.coerce
    .number({ required_error: "La ciudad es obligatoria." })
    .int()
    .positive(),

  direccion: z
    .string({ required_error: "La dirección es obligatoria." })
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(150),

  telefono: z.coerce
    .string({ required_error: "El telefono es obligatorio." })
    .trim()
    .min(9, "El teleono no es válido")
    .max(15, "El telefono no es válido."),

  correo: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido.")
    .max(150),
});

export const createOperationCenterSchema = z.array(operationCenterObjectSchema);

export const updateOperationCenterSchema =
  operationCenterObjectSchema.partial();
