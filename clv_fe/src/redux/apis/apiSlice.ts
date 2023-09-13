import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { customNotification } from '../../common/notification';

//* Base query for access token
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders(headers, { getState }) {
    const state = getState() as RootState;
    const token = state.authReducer.accessToken;
    if (token) headers.set('authorization', `Bearer ${token}`);

    return headers;
  },
});

//* Base query for authenticate/authorize token
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token expired
  if (result?.error?.status === 401) {
    console.log('Token expired!');
    customNotification({
      type: 'error',
      message: 'Unauthorized!',
      description: 'Token expired! Please login again.',
    });
    api.dispatch(apiSlice.util.resetApiState());
    api.dispatch(logout());
  }

  // // If current user does not have permission with action/route
  // if (result?.error?.status === 403) {
  //   console.log('Sending refresh token...');
  //   // Send refresh token to get new access token
  //   const refreshResult = await baseQuery('/refresh', api, extraOptions);
  //   console.log(refreshResult);

  //   if (refreshResult?.data) {
  //     const user = api.getState().authReducer.user;
  //     // Store the new token
  //     api.dispatch(setCredentials(refreshResult?.data));
  //     // Retry the original query with access token
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     api.dispatch(logout());
  //   }
  // }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['USER_INFORMATION', 'USERS', 'ROLES', 'PERMISSIONS'],
  endpoints: (builder) => ({}),
});

// apiSlice.useMutationErrorHandler(async (ctx, next) => {
//   try {
//     await next(ctx);
//   } catch (error) {
//     if (error instanceof BaseQueryError && error.status === 401) {
// // Handle expired token here
// dispatch(logout());
// // Or redirect user to log in page
//       console.error('Token expired!');
//     }
// }
// });
