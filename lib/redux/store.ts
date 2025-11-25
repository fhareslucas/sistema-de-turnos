import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import turnosReducer from './slices/turnosSlice';
import mesasReducer from './slices/mesasSlice';
import serviciosReducer from './slices/serviciosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    turnos: turnosReducer,
    mesas: mesasReducer,
    servicios: serviciosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;