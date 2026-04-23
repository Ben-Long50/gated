import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useRouteHistoryStore from 'src/stores/routeHistoryStore';

const RouteHistoryTracker = () => {
  const location = useLocation();
  const push = useRouteHistoryStore((state) => state.push);

  useEffect(() => {
    const path = location.pathname + location.search;
    push(path);
  }, [location, push]);

  return null;
};

export default RouteHistoryTracker;
