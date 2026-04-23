import { createContext, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import useAuthenticatedUserQuery from 'src/hooks/user hooks/useAuthenticatedUserQuery';

export const AuthContext = createContext({
  user: {
    id: null,
    liveCampaignId: null,
    username: null,
    firstName: null,
    lastName: null,
    profilePicture: null,
    role: null,
    ownerCampaigns: [] as { id: number }[],
    pendingCampaigns: [] as { id: number }[],
    playerCampaigns: [] as { id: number }[],
  },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    data: authenticatedUser,
    isError,
    isSuccess,
    isLoading,
  } = useAuthenticatedUserQuery();

  useEffect(() => {
    if (
      (isSuccess && pathname === '/signin') ||
      (isSuccess && pathname === '/signup') ||
      (isSuccess && pathname === '/')
    ) {
      navigate('/glam/codex/');
    } else if (isError) {
      navigate('/signin');
    }
  }, [isSuccess, isError]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user: authenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
