import { Route } from 'react-router-dom';
import Page from 'src/components/Page';
import PictureRoutes from './PictureRoutes';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import Map from 'src/components/mapComponents/map/Map';
import UserMapList from 'src/components/mapComponents/map/UserMapList';

const MapTabRoutes = () => {
  return (
    <Route path="maps">
      <Route
        path=""
        element={
          <Page title="Maps">
            <UserMapList />
          </Page>
        }
      />
      <Route path=":mapId" element={<Map />} />
      <Route path=":mapId/update" element={<MapBuilder />}>
        <Route path="save" element={<MapSaveModal />} />
        <Route path="tileList" element={<TileListModal />} />
        {PictureRoutes()}
      </Route>
      <Route path="create" element={<MapBuilder />}>
        <Route path="save" element={<MapSaveModal />} />
        <Route path="tileList" element={<TileListModal />} />
        {PictureRoutes()}
      </Route>
    </Route>
  );
};

export default MapTabRoutes;
