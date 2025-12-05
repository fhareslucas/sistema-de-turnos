import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { User, LoginCredentials, AuthResponse, ApiResponse } from "@/types";
import { setCookie, removeCookie } from "@/lib/cookieUtils";
import axios from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      let token: string;
      let user: User;

      if (response.data.success && response.data.data) {
        token = response.data.data.token;
        user = response.data.data.user;
      } else if ("token" in response.data && "user" in response.data) {
        const directResponse = response.data as unknown as {
          token: string;
          user: User;
        };
        token = directResponse.token;
        user = directResponse.user;
      } else {
        return rejectWithValue("Formato de respuesta inválido");
      }
      localStorage.setItem("token", token);
      setCookie("token", token, 7); 

      return { token, user };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Error al iniciar sesión"
        );
      }
      return rejectWithValue("Error al iniciar sesión");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<User>>("/auth/profile");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Error al obtener perfil"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Error al obtener perfil"
        );
      }
      return rejectWithValue("Error al obtener perfil");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      removeCookie("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        removeCookie("token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
