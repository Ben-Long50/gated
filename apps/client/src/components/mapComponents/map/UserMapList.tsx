import { useContext } from 'react';
import MapList from './MapList';
import { AuthContext } from 'src/contexts/AuthContext';
import Page from 'src/components/Page';
import { useNavigate } from 'react-router-dom';

const UserMapList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const mapIds = user.maps.map((map) => map.id);

  return (
    <Page title="Maps">
      <MapList mapIds={mapIds} onClick={(id) => navigate(`${id}`)} />
    </Page>
  );
};

export default UserMapList;
