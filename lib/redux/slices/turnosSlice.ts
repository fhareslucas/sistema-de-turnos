import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import {
  Turno,
  CreateTurnoData,
  TurnosResponse,
  EstadisticasData,
  ApiResponse,
} from "@/types";

interface TurnosState {
  turnos: Turno[];
  estadisticas: EstadisticasData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TurnosState = {
  turnos: [],
  estadisticas: null,
  loading: false,
  error: null,
};

export const fetchTurnos = createAsyncThunk(
  "turnos/fetchTurnos",
  async (params?: { estado?: string; tipo_servicio_id?: string; fecha?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      // Filtrar parámetros undefined para evitar errores 400
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      ) : {};
      
      const response = await api.get<ApiResponse<TurnosResponse>>("/turnos", {
        params: cleanParams,
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al cargar turnos");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al cargar turnos");
      }
      return rejectWithValue("Error al cargar turnos");
    }
  }
);

export const fetchEstadisticas = createAsyncThunk(
  "turnos/fetchEstadisticas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EstadisticasData>>("/turnos/estadisticas");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al cargar estadísticas");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al cargar estadísticas");
      }
      return rejectWithValue("Error al cargar estadísticas");
    }
  }
);

export const createTurno = createAsyncThunk(
  "turnos/createTurno",
  async (data: CreateTurnoData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Turno>>("/turnos", data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al crear turno");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al crear turno");
      }
      return rejectWithValue("Error al crear turno");
    }
  }
);

export const llamarTurno = createAsyncThunk(
  "turnos/llamarTurno",
  async ({ id, data }: { id: string; data: { mesa_id: string } }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<Turno>>(`/turnos/${id}/llamar`, data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al llamar turno");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al llamar turno");
      }
      return rejectWithValue("Error al llamar turno");
    }
  }
);

export const completarTurno = createAsyncThunk(
  "turnos/completarTurno",
  async ({ id, observaciones }: { id: string; observaciones?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<Turno>>(`/turnos/${id}/completar`, {
        observaciones,
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al completar turno");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al completar turno");
      }
      return rejectWithValue("Error al completar turno");
    }
  }
);

export const cancelarTurno = createAsyncThunk(
  "turnos/cancelarTurno",
  async ({ id, observaciones }: { id: string; observaciones?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<Turno>>(`/turnos/${id}/cancelar`, { observaciones });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al cancelar turno");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al cancelar turno");
      }
      return rejectWithValue("Error al cancelar turno");
    }
  }
);

const turnosSlice = createSlice({
  name: "turnos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurnos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTurnos.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.turnos = action.payload.turnos;
        }
      })
      .addCase(fetchTurnos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEstadisticas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEstadisticas.fulfilled, (state, action) => {
        state.loading = false;
        state.estadisticas = action.payload;
      })
      .addCase(fetchEstadisticas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTurno.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos.unshift(action.payload);
      })
      .addCase(createTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(llamarTurno.fulfilled, (state, action) => {
        const index = state.turnos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.turnos[index] = action.payload;
        }
      })
      .addCase(completarTurno.fulfilled, (state, action) => {
        const index = state.turnos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.turnos[index] = action.payload;
        }
      })
      .addCase(cancelarTurno.fulfilled, (state, action) => {
        const index = state.turnos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.turnos[index] = action.payload;
        }
      });
  },
});

export const { clearError } = turnosSlice.actions;
export default turnosSlice.reducer;
