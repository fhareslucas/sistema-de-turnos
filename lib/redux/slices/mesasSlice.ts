import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@/services/api";
import { Mesa, CreateMesaData, UpdateMesaData, ApiResponse } from "@/types";

interface MesasState {
  mesas: Mesa[];
  loading: boolean;
  error: string | null;
}

const initialState: MesasState = {
  mesas: [],
  loading: false,
  error: null,
};

export const fetchMesas = createAsyncThunk(
  "mesas/fetchMesas",
  async (
    params: { activo?: boolean; estado?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<Mesa[]>>("/mesas", {
        params,
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al cargar mesas");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al cargar mesas");
      }
      return rejectWithValue("Error al cargar mesas");
    }
  }
);

export const createMesa = createAsyncThunk(
  "mesas/createMesa",
  async (data: CreateMesaData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Mesa>>("/mesas", data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Error al crear mesa");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al crear mesa");
      }
      return rejectWithValue("Error al crear mesa");
    }
  }
);

export const updateMesa = createAsyncThunk(
  "mesas/updateMesa",
  async (
    { id, data }: { id: string; data: UpdateMesaData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<Mesa>>(`/mesas/${id}`, data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Error al actualizar mesa"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 409) {
          return rejectWithValue("Este número de mesa ya está en uso");
        } else if (status === 404) {
          return rejectWithValue("Mesa no encontrada");
        } else if (status === 400) {
          return rejectWithValue(
            message || "Los datos ingresados no son válidos"
          );
        } else if (message) {
          return rejectWithValue(message);
        }
      }

      if (error instanceof Error && error.message) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Error al actualizar la mesa. Por favor, inténtalo de nuevo"
      );
    }
  }
);

export const deleteMesa = createAsyncThunk(
  "mesas/deleteMesa",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`/mesas/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message || "Error al eliminar mesa");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al eliminar mesa");
      }
      return rejectWithValue("Error al eliminar mesa");
    }
  }
);

const mesasSlice = createSlice({
  name: "mesas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMesas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMesas.fulfilled, (state, action) => {
        state.loading = false;
        state.mesas = action.payload;
      })
      .addCase(fetchMesas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMesa.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMesa.fulfilled, (state, action) => {
        state.loading = false;
        state.mesas.push(action.payload);
      })
      .addCase(createMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMesa.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMesa.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mesas.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.mesas[index] = action.payload;
        }
      })
      .addCase(updateMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMesa.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMesa.fulfilled, (state, action) => {
        state.loading = false;
        state.mesas = state.mesas.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mesasSlice.reducer;
