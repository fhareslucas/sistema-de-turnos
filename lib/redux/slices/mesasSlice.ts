import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { Mesa, CreateMesaData, UpdateMesaData } from "@/types";

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

export const fetchMesas = createAsyncThunk("mesas/fetchMesas", async () => {
  const response = await api.get("/mesas");
  return response.data.data;
});

export const createMesa = createAsyncThunk(
  "mesas/createMesa",
  async (data: CreateMesaData) => {
    const response = await api.post("/mesas", data);
    return response.data.data;
  }
);

export const updateMesa = createAsyncThunk(
  "mesas/updateMesa",
  async ({ id, data }: { id: string; data: UpdateMesaData }) => {
    const response = await api.put(`/mesas/${id}`, data);
    return response.data.data;
  }
);

export const deleteMesa = createAsyncThunk(
  "mesas/deleteMesa",
  async (id: string) => {
    await api.delete(`/mesas/${id}`);
    return id;
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
      .addCase(createMesa.fulfilled, (state, action) => {
        state.mesas.push(action.payload);
      })
      .addCase(updateMesa.fulfilled, (state, action) => {
        const index = state.mesas.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.mesas[index] = action.payload;
        }
      })
      .addCase(deleteMesa.fulfilled, (state, action) => {
        state.mesas = state.mesas.filter((m) => m.id !== action.payload);
      });
  },
});

export default mesasSlice.reducer;
