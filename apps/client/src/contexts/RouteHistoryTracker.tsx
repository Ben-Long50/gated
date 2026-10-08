import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useRouteHistoryStore from 'src/stores/routeHistoryStore';

const RouteHistoryTracker = () => {
  const location = useLocation();
  const push = useRouteHistoryStore((state) => state.push);
  const history = useRouteHistoryStore((state) => state.history);

  useEffect(() => {
    const path = location.pathname + location.search;
    const key = location.key;

    if (typeof history !== 'object') {
      localStorage.removeItem('routeHistory');
    }

    if (history.every((d) => d.key !== key)) {
      push({ path, key });
    }
  }, [location, push]);

  return null;
};

export default RouteHistoryTracker;
