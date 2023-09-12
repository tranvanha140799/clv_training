import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    isDisable?: boolean;
    isPending?: boolean;
    officeCode?: string | null;
    country?: string | null;
    globalId?: string | null;
    roles?: [];
  };
  accessToken: string;
};

const initialState: InitialState = {
  userInfo: {
    firstName: '',
    lastName: '',
    email: '',
    isDisable: false,
    isPending: false,
    officeCode: '',
    country: '',
    globalId: '',
    roles: [],
  },
  accessToken: '',
};

const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    isSignedIn: (state) => {
      // Get user information from localStorage
      const userFromStorage = localStorage.getItem('USER');
      // Check if storageUser !== null
      if (userFromStorage) {
        const userInfo = JSON.parse(userFromStorage);
        if (typeof userInfo === 'object' && userInfo.accessToken) {
          const { accessToken, user } = userInfo;
          state.userInfo = { ...user };
          state.accessToken = accessToken;
        }
      }
    },
    setCredentials: (state, action) => {
      const { accessToken, userInfo } = action.payload;
      state.accessToken = accessToken;
      state.userInfo = userInfo;
      localStorage.setItem(
        'USER',
        JSON.stringify({ accessToken: accessToken, user: userInfo })
      );
    },
    logout: (state) => {
      state.accessToken = '';
      state.userInfo = initialState.userInfo;
      localStorage.removeItem('USER');
    },
  },
});

export const { isSignedIn, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
