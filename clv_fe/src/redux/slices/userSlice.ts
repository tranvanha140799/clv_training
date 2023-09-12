import { createSlice } from '@reduxjs/toolkit';

type initialState = {
  users: object;
};

const initialState: initialState = {
  users: [],
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    fetchListUser: (state, action) => {
      if (action.payload.users) state.users = action.payload.users;
    },
  },
});

export const { fetchListUser } = userSlice.actions;
export default userSlice.reducer;
