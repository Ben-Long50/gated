import { Route } from 'react-router-dom';
import Page from 'src/components/Page';
import PictureRoutes from './PictureRoutes';
import MapList from 'src/components/mapComponents/map/MapList';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import Map from 'src/components/mapComponents/map/Map';

const MapTabRoutes = () => {
  return (
    <Route path="maps">
      <Route
        path=""
        element={
          <Page title="Maps">
            <MapList />
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
