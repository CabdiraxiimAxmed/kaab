import { createSlice } from '@reduxjs/toolkit';

interface SocketType {
  value: any;
}

const initialState: SocketType = {
  value: () => '',
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
