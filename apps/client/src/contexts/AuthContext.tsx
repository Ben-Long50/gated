import { createContext, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import useAuthenticatedUserQuery from 'src/hooks/user hooks/useAuthenticatedUserQuery';
import { User } from 'src/types/user';

const defaultUser: User = {
  id: null,
  username: '',
  firstName: '',
  lastName: '',
  profilePicture: '',
  role: 'GUEST',
  characters: [],
  ownerCampaigns: [] as { id: number }[],
  pendingCampaigns: [] as { id: number }[],
  playerCampaigns: [] as { id: number }[],
};

export const AuthContext = createContext({ user: defaultUser });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    data: user,
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
      navigate('/glam/codex?tab=equipment');
    } else if (isError) {
      navigate('/signin');
    }
  }, [isSuccess, isError]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
