import { Route } from 'react-router-dom';
import Page from 'src/components/Page';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import UserMapList from 'src/components/mapComponents/map/UserMapList';
import Modal from 'src/components/modals/Modal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import MapPage from 'src/components/mapComponents/map/MapPage';

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
      <Route path=":mapId" element={<MapPage />} />
      <Route path=":mapId/update" element={<MapBuilder />}>
        <Route path="modal" element={<Modal />}>
          <Route path="save" element={<MapSaveModal />} />
          <Route path="tileList" element={<TileListModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
      <Route path="create" element={<MapBuilder />}>
        <Route path="modal" element={<Modal />}>
          <Route path="save" element={<MapSaveModal />} />
          <Route path="tileList" element={<TileListModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
    </Route>
  );
};

export default MapTabRoutes;
