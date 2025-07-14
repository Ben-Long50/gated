import { Route } from 'react-router-dom';
import Campaign from 'src/components/Campaign';
import CampaignCharacterList from 'src/components/CampaignCharacterList';
import CampaignForm from 'src/components/CampaignForm';
import Campaigns from 'src/components/Campaigns';
import Faction from 'src/components/Faction';
import FactionForm from 'src/components/FactionForm';
import RollSimulator from 'src/components/RollSimulator';
import SessionRoutes from './SessionRoutes';
import { CampaignProvider } from 'src/contexts/CampaignContext';
import CampaignAffiliations from 'src/components/CampaignAffiliations';
import RollModal from 'src/components/modals/RollModal';
import CharacterRoutes from './CharacterRoutes';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Notes from 'src/components/Notes';
import CalendarModal from 'src/components/modals/CalendarModal';
import EventForm from 'src/components/EventForm';
import TimeModal from 'src/components/modals/TimeModal';
import MapBuilder from 'src/components/maps/MapBuilder';
import MapSaveModal from 'src/components/modals/MapSaveModal';
import MapList from 'src/components/maps/MapList';
import DeleteModal from 'src/components/modals/DeleteModal';
import TileListModal from 'src/components/maps/TileListModal';
import Map from 'src/components/maps/Map';
import InitiativeModal from 'src/components/modals/InitiativeModal';
import CharacterMenuRoutes from './CharacterMenuRoutes';

const CampaignTabRoutes = () => {
  return (
    <Route path="campaigns">
      <Route path="" element={<Campaigns />} />
      <Route path=":campaignId" element={<CampaignProvider />}>
        <Route path="" element={<Campaign />}>
          <Route
            path="conditions/:conditionId"
            element={<DescriptionModal />}
          />
          <Route path="calendar/time" element={<TimeModal />} />
          <Route path="calendar/:month/:day" element={<CalendarModal />} />
          <Route path="calendar/:month/:day/newEvent" element={<EventForm />} />
        </Route>
        <Route
          path="update"
          element={<CampaignForm title="Update" mode="update" />}
        />
        <Route path="factions/:factionId">
          <Route index element={<Faction />} />
          <Route
            path="update"
            element={<FactionForm title="Update" mode="update" />}
          />
        </Route>
        <Route path="characters">
          <Route path="" element={<CampaignCharacterList />}>
            <Route
              path="conditions/:conditionId"
              element={<DescriptionModal />}
            />
          </Route>
          <Route path=":characterId/notes" element={<Notes />} />
          {CharacterRoutes()}
        </Route>
        {SessionRoutes()}
        <Route path="maps">
          <Route path=":mapId" element={<Map />}>
            <Route path="characters">{CharacterMenuRoutes()}</Route>
            <Route path="initiative" element={<InitiativeModal />} />
          </Route>
          <Route path="locations" element={<MapList />}>
            <Route path=":mapId/delete" element={<DeleteModal />} />
          </Route>
          <Route path="components" element={<MapList />}>
            <Route path=":mapId/delete" element={<DeleteModal />} />
          </Route>
          <Route path="drafts" element={<MapList />}>
            <Route path=":mapId/delete" element={<DeleteModal />} />
          </Route>
          <Route path="create" element={<MapBuilder key="create" />}>
            <Route path="save" element={<MapSaveModal />} />
            <Route path="tileList" element={<TileListModal />} />
          </Route>
          <Route path=":mapId/update" element={<MapBuilder key="update" />}>
            <Route path="save" element={<MapSaveModal />} />
            <Route path="tileList" element={<TileListModal />} />
          </Route>
        </Route>

        <Route path="affiliations" element={<CampaignAffiliations />} />
        <Route path="rollSimulator" element={<RollSimulator />}>
          <Route path="rollResults" element={<RollModal />} />
        </Route>
      </Route>
      <Route
        path="create"
        element={<CampaignForm title="Create" mode="create" />}
      />
      <Route path="rollSimulator" element={<RollSimulator />}>
        <Route path="rollResults" element={<RollModal />} />
      </Route>
    </Route>
  );
};

export default CampaignTabRoutes;
