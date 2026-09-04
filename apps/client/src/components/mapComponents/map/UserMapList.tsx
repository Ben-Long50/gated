import { useContext } from 'react';
import MapList from './MapList';
import { AuthContext } from 'src/contexts/AuthContext';

const UserMapList = () => {
  const { user } = useContext(AuthContext);

  const mapIds = user.maps.map((map) => map.id);

  return <MapList mapIds={mapIds} />;
};

export default UserMapList;
