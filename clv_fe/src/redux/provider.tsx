'use client';

import { Provider } from 'react-redux';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <GoogleOAuthProvider clientId="650332582640-n1g3tmv9jn55phkodqdc9h4091idmgih.apps.googleusercontent.com"> */}
      {children}
      {/* </GoogleOAuthProvider> */}
    </Provider>
  );
}
