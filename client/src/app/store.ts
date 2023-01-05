import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user';
import socketReducer from '../features/socket';

export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
