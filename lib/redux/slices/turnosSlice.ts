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
  async (params?: { estado?: string; tipo_servicio_id?: string }) => {
    const response = await api.get<ApiResponse<TurnosResponse>>("/turnos", {
      params,
    });
    return response.data.data;
  }
);

export const fetchEstadisticas = createAsyncThunk(
  "turnos/fetchEstadisticas",
  async () => {
    const response = await api.get("/turnos/estadisticas");
    return response.data.data;
  }
);

export const createTurno = createAsyncThunk(
  "turnos/createTurno",
  async (data: CreateTurnoData) => {
    const response = await api.post("/turnos", data);
    return response.data.data;
  }
);

export const llamarTurno = createAsyncThunk(
  "turnos/llamarTurno",
  async ({ id, data }: { id: string; data: { mesa_id: string } }) => {
    const response = await api.put(`/turnos/${id}/llamar`, data);
    return response.data.data;
  }
);

export const completarTurno = createAsyncThunk(
  "turnos/completarTurno",
  async ({ id, observaciones }: { id: string; observaciones?: string }) => {
    const response = await api.put(`/turnos/${id}/completar`, {
      observaciones,
    });
    return response.data.data;
  }
);

export const cancelarTurno = createAsyncThunk(
  "turnos/cancelarTurno",
  async ({ id, observaciones }: { id: string; observaciones?: string }) => {
    const response = await api.put(`/turnos/${id}/cancelar`, { observaciones });
    return response.data.data;
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
        state.error = action.error.message || "Error al cargar turnos";
      })
      .addCase(fetchEstadisticas.fulfilled, (state, action) => {
        state.estadisticas = action.payload;
      })
      .addCase(createTurno.fulfilled, (state, action) => {
        state.turnos.unshift(action.payload);
      });
  },
});

export const { clearError } = turnosSlice.actions;
export default turnosSlice.reducer;
