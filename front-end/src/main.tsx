import App from '@/App';
import theme from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/stores/store';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SocketProvider key={store.getState().auth.token}>
            <CssBaseline />
            <App />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
