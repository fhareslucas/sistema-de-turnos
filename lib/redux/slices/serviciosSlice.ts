import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { TipoServicio, CreateServicioData, UpdateServicioData } from "@/types";

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
  async () => {
    const response = await api.get("/servicios");
    return response.data.data;
  }
);

export const createServicio = createAsyncThunk(
  "servicios/createServicio",
  async (data: CreateServicioData) => {
    const response = await api.post("/servicios", data);
    return response.data.data;
  }
);

export const updateServicio = createAsyncThunk(
  "servicios/updateServicio",
  async ({ id, data }: { id: string; data: UpdateServicioData }) => {
    const response = await api.put(`/servicios/${id}`, data);
    return response.data.data;
  }
);

export const deleteServicio = createAsyncThunk(
  "servicios/deleteServicio",
  async (id: string) => {
    await api.delete(`/servicios/${id}`);
    return id;
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
      .addCase(createServicio.fulfilled, (state, action) => {
        state.servicios.push(action.payload);
      })
      .addCase(updateServicio.fulfilled, (state, action) => {
        const index = state.servicios.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.servicios[index] = action.payload;
        }
      })
      .addCase(deleteServicio.fulfilled, (state, action) => {
        state.servicios = state.servicios.filter(
          (s) => s.id !== action.payload
        );
      });
  },
});

export default serviciosSlice.reducer;
