import { useContext } from 'react';
import MapList from './MapList';
import { AuthContext } from 'src/contexts/AuthContext';
import Page from 'src/components/Page';

const UserMapList = () => {
  const { user } = useContext(AuthContext);

  const mapIds = user.maps.map((map) => map.id);

  return (
    <Page title="Maps">
      <MapList mapIds={mapIds} />
    </Page>
  );
};

export default UserMapList;
