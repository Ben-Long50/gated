import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import queryClient from './queryClient';
import ThemeProvider from './contexts/ThemeContext';
import AuthProvider from './contexts/AuthContext';
import LayoutProvider from './contexts/LayoutContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CampaignProvider } from './contexts/CampaignContext';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LayoutProvider>
            <CampaignProvider>
              <Outlet />
            </CampaignProvider>
          </LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default App;
