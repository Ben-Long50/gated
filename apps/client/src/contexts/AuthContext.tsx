import { createContext, ReactNode, useEffect } from 'react';
import useAccountQuery from '../hooks/useAccountQuery/useAccountQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

export const AuthContext = createContext({
  user: {
    id: null,
    liveCampaignId: null,
    username: null,
    firstName: null,
    lastName: null,
    profilePicture: null,
    role: null,
  },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    data: user,
    isError,
    isSuccess,
    isLoading,
    isPending,
  } = useAccountQuery();

  useEffect(() => {
    if (
      (isSuccess && pathname === '/signin') ||
      (isSuccess && pathname === '/signup')
    ) {
      navigate('/glam/codex/');
    } else if (isError) {
      navigate('/signin');
    }
  }, [isSuccess, isError]);

  if (isLoading || isPending) {
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
