import { createContext, ReactNode, useEffect } from 'react';
import useAccountQuery from '../hooks/useAccountQuery/useAccountQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import useUserQuery from 'src/hooks/useUserQuery/useUserQuery';

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
    data: authentication,
    isError,
    isSuccess,
    isLoading: authenticationLoading,
    isPending: authenticationPending,
  } = useAccountQuery();

  const { data: user, isLoading: userLoading } = useUserQuery(
    authentication?.userId,
  );

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

  const isLoading =
    authenticationPending || authenticationLoading || userLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
