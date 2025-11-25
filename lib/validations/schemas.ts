import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const createTurnoSchema = z.object({
  tipo_servicio_id: z.string().uuid("Selecciona un tipo de servicio válido"),
  nombre_cliente: z.string().max(100).optional(),
  prioridad: z.boolean().optional(),
  observaciones: z.string().max(500).optional(),
});

export const createMesaSchema = z.object({
  numero: z.number().int().positive("El número debe ser positivo"),
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50),
  estado: z.enum(["disponible", "ocupada", "inactiva"]).optional(),
  activo: z.boolean().optional(),
});

export const createServicioSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50),
  codigo: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(10)
    .toUpperCase(),
  descripcion: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color hexadecimal inválido"),
  tiempo_estimado: z.number().int().min(1).max(180),
  activo: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateTurnoFormData = z.infer<typeof createTurnoSchema>;
export type CreateMesaFormData = z.infer<typeof createMesaSchema>;
export type CreateServicioFormData = z.infer<typeof createServicioSchema>;
