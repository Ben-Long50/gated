import { useNavigate, useLocation, NavigateOptions } from 'react-router-dom';

export const useNavigateWithQuery = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  return (to: string, options?: NavigateOptions) => {
    const separator = to.includes('?') ? '&' : '?';
    const targetPath = search ? `${to}${separator}${search.substring(1)}` : to;

    navigate(targetPath, options);
  };
};
