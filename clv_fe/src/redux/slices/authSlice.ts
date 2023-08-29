import { createSlice } from '@reduxjs/toolkit';

type initialState = {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    isDisable?: boolean;
    isPending?: boolean;
    officeCode?: string | null;
    country?: string | null;
    globalId?: string | null;
  };
  accessToken: string;
};

// Get user information from localStorage
const storageUser = localStorage.getItem('USER');
let user;
let token;
// Check if storageUser !== null
if (storageUser) {
  const userInfo = JSON.parse(storageUser);
  if (typeof userInfo === 'object' && userInfo.accessToken) {
    const { accessToken, ...args } = userInfo;
    user = args;
    token = accessToken;
  }
}

const initialState: initialState = {
  userInfo: user || {
    firstName: '',
    lastName: '',
    email: '',
    isDisable: false,
    isPending: false,
    officeCode: '',
    country: '',
    globalId: '',
  },
  accessToken: token || '',
};

const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    // isSignedIn: (state) => {
    //   // Get user information from localStorage
    //   const storageUser = localStorage.getItem('USER');
    //   // Check if storageUser !== null
    //   if (storageUser) {
    //     const userInfo = JSON.parse(storageUser);
    //     if (typeof userInfo === 'object' && userInfo.accessToken) {
    //       const { accessToken, ...args } = userInfo;
    //       state.userInfo = args;
    //       state.accessToken = accessToken;
    //     }
    //   }
    // },
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
      localStorage.removeItem('ACCESS_TOKEN');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
