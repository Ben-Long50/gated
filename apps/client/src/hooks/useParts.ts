import { useLocation } from 'react-router-dom';

const useParts = () => {
  const location = useLocation();
  const parts = location.pathname.split('/');

  return { parts };
};

export default useParts;
