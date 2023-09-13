import { createSlice } from '@reduxjs/toolkit';

type InitialState = { accessToken: string };

const initialState: InitialState = { accessToken: '' };

const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    isSignedIn: (state) => {
      // Get user token from localStorage
      const userFromStorage = localStorage.getItem('USER');
      // Check if storageUser !== null
      if (userFromStorage) {
        const userInfo = JSON.parse(userFromStorage);
        if (typeof userInfo === 'object' && userInfo.accessToken)
          state.accessToken = userInfo.accessToken;
      }
    },
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      localStorage.setItem('USER', JSON.stringify({ accessToken: accessToken }));
    },
    logout: (state) => {
      state.accessToken = '';
      localStorage.removeItem('USER');
    },
  },
});

export const { isSignedIn, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
