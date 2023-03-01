import { createSlice } from '@reduxjs/toolkit';

interface UserType {
  value: {
    name: string;
    username: string;
    email: string;
    default_language: string;
  };
}

const initialState: UserType = {
  value: {
    name: '',
    username: '',
    email: '',
    default_language: ''
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
