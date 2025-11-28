export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "operador";
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface TipoServicio {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  color: string;
  tiempo_estimado: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mesa {
  id: string;
  numero: number;
  nombre: string;
  estado: "disponible" | "ocupada" | "inactiva";
  activo: boolean;
  created_at: string;
  updated_at: string;
  turnos?: Turno[];
}

export interface Turno {
  id: string;
  codigo: string;
  tipo_servicio_id: string;
  mesa_id?: string;
  estado: "en_espera" | "en_atencion" | "completado" | "cancelado";
  prioridad: boolean;
  nombre_cliente?: string;
  observaciones?: string;
  atendido_por?: string;
  hora_llamado?: string;
  hora_atencion?: string;
  hora_finalizacion?: string;
  created_at: string;
  updated_at: string;
  tipo_servicio?: TipoServicio;
  mesa?: Mesa;
  operador?: User;
}

export interface CreateTurnoData {
  tipo_servicio_id: string;
  nombre_cliente?: string;
  prioridad?: boolean;
  observaciones?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TurnosResponse {
  turnos: Turno[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EstadisticasData {
  hoy: {
    en_espera: number;
    en_atencion: number;
    completados: number;
    total: number;
  };
}

export interface CreateMesaData {
  numero: number;
  nombre: string;
  estado?: "disponible" | "ocupada" | "inactiva";
  activo?: boolean;
}

export interface UpdateMesaData extends Partial<CreateMesaData> {
  activo?: boolean;
}

export interface CreateServicioData {
  nombre: string;
  codigo: string;
  descripcion?: string;
  color: string;
  tiempo_estimado: number;
}

export interface UpdateServicioData extends Partial<CreateServicioData> {
  activo?: boolean;
}
