import { useParams } from 'react-router-dom';
import MapList from './MapList';
import Loading from 'src/components/Loading';
import useAddMapMutation from 'src/hooks/useAddMapMutation/useAddMapMutation';
import NavTabs from 'src/components/NavTabs';
import BtnAuth from 'src/components/buttons/BtnAuth';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Page from 'src/components/Page';

const MapAdd = () => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const [tab, setTab] = useState('custom');

  const addMap = useAddMapMutation(Number(campaignId));

  let mapIdList = [] as number[];

  switch (tab) {
    case 'custom':
      mapIdList = user.maps.map((map) => map.id);
      break;
    case 'prebuilt':
      mapIdList = [];
      break;
    default:
      mapIdList = [];
      break;
  }

  return (
    <Page title={campaignId ? 'Add Campaign Map' : 'Add User Map'}>
      <NavTabs className="grid-cols-2">
        <BtnAuth active={tab === 'custom'} onClick={() => setTab('custom')}>
          Custom Maps
        </BtnAuth>
        <BtnAuth active={tab === 'prebuilt'} onClick={() => setTab('prebuilt')}>
          Prebuilt Maps
        </BtnAuth>
      </NavTabs>
      {addMap.isPending ? (
        <div className="mx-auto flex items-center gap-8">
          <Loading size={2} />
          <h2>
            {campaignId ? 'Adding map to campaign' : 'Adding map user maps'}
          </h2>
        </div>
      ) : (
        <MapList mapIds={mapIdList} onClick={(id) => addMap.mutate(id)} />
      )}
    </Page>
  );
};

export default MapAdd;
