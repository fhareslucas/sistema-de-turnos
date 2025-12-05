import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import {
  TipoServicio,
  CreateServicioData,
  UpdateServicioData,
  ApiResponse,
} from "@/types";

interface ServiciosState {
  servicios: TipoServicio[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiciosState = {
  servicios: [],
  loading: false,
  error: null,
};

export const fetchServicios = createAsyncThunk(
  "servicios/fetchServicios",
  async (params: { activo?: boolean } | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<TipoServicio[]>>(
        "/servicios",
        { params }
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Error al cargar servicios"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al cargar servicios");
      }
      return rejectWithValue("Error al cargar servicios");
    }
  }
);

export const createServicio = createAsyncThunk(
  "servicios/createServicio",
  async (data: CreateServicioData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<TipoServicio>>(
        "/servicios",
        data
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Error al crear servicio"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al crear servicio");
      }
      return rejectWithValue("Error al crear servicio");
    }
  }
);

export const updateServicio = createAsyncThunk(
  "servicios/updateServicio",
  async (
    { id, data }: { id: string; data: UpdateServicioData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<TipoServicio>>(
        `/servicios/${id}`,
        data
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Error al actualizar servicio"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al actualizar servicio");
      }
      return rejectWithValue("Error al actualizar servicio");
    }
  }
);

export const deleteServicio = createAsyncThunk(
  "servicios/deleteServicio",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`/servicios/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(
        response.data.message || "Error al eliminar servicio"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Error al eliminar servicio");
      }
      return rejectWithValue("Error al eliminar servicio");
    }
  }
);

const serviciosSlice = createSlice({
  name: "servicios",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicios.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServicios.fulfilled, (state, action) => {
        state.loading = false;
        state.servicios = action.payload;
      })
      .addCase(fetchServicios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createServicio.pending, (state) => {
        state.loading = true;
      })
      .addCase(createServicio.fulfilled, (state, action) => {
        state.loading = false;
        state.servicios.push(action.payload);
      })
      .addCase(createServicio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateServicio.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateServicio.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.servicios.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.servicios[index] = action.payload;
        }
      })
      .addCase(updateServicio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteServicio.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteServicio.fulfilled, (state, action) => {
        state.loading = false;
        state.servicios = state.servicios.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteServicio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default serviciosSlice.reducer;
