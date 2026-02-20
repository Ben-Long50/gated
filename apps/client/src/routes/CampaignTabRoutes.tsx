import { Route } from 'react-router-dom';
import Campaign from 'src/components/Campaign';
import CampaignCharacterList from 'src/components/CampaignCharacterList';
import CampaignForm from 'src/components/CampaignForm';
import Campaigns from 'src/components/Campaigns';
import Faction from 'src/components/Faction';
import FactionForm from 'src/components/FactionForm';
import RollSimulator from 'src/components/RollSimulator';
import SessionRoutes from './SessionRoutes';
import CampaignAffiliations from 'src/components/CampaignAffiliations';
import RollModal from 'src/components/modals/RollModal';
import CharacterRoutes from './CharacterRoutes';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Notes from 'src/components/Notes';
import CalendarModal from 'src/components/modals/CalendarModal';
import EventForm from 'src/components/EventForm';
import TimeModal from 'src/components/modals/TimeModal';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import MapList from 'src/components/mapComponents/map/MapList';
import DeleteModal from 'src/components/modals/DeleteModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import Map from 'src/components/mapComponents/map/Map';
import InitiativeModal from 'src/components/modals/InitiativeModal';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import Encounter from 'src/components/encounterComponents/Encounter';
import ActionListModal from 'src/components/modals/ActionListModal';
import EncounterForm from 'src/components/encounterComponents/EncounterForm';
import EncounterList from 'src/components/encounterComponents/EncounterList';
import ActionQueueModal from 'src/components/encounterComponents/ActionQueueModal';
import HistoryModal from 'src/components/modals/HistoryModal';
import { EncounterProvider } from 'src/contexts/EncounterContext';
import EncounterFormMap from 'src/components/encounterComponents/EncounterFormMap';
import EncounterFormInfo from 'src/components/encounterComponents/EncounterFormInfo';
import ResetModal from 'src/components/encounterComponents/ResetModal';
import GangForm from 'src/components/GangForm';
import CharacterSelectModal from 'src/components/CharacterSelectModal';
import Gangs from 'src/components/Gangs';
import GangPage from 'src/components/GangPage';

const CampaignTabRoutes = () => {
  return (
    <Route path="campaigns">
      <Route path="" element={<Campaigns />} />
      <Route path=":campaignId">
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
        <Route path="gangs">
          <Route path="" element={<Gangs />} />
          <Route path=":gangId" element={<GangPage />} />
          <Route path="create" element={<GangForm />}>
            <Route path="characterSelect" element={<CharacterSelectModal />} />
          </Route>
        </Route>
        {SessionRoutes()}
        <Route path="maps">
          <Route path="" element={<MapList />} />
          <Route path=":mapId" element={<Map />}>
            <Route path="characters">{CharacterMenuRoutes()}</Route>
            <Route path="initiative" element={<InitiativeModal />} />
          </Route>
          <Route path=":mapId/delete" element={<DeleteModal />} />
          <Route path="create" element={<MapBuilder key="create" />}>
            <Route path="save" element={<MapSaveModal />} />
            <Route path="tileList" element={<TileListModal />} />
          </Route>
          <Route path=":mapId/update" element={<MapBuilder key="update" />}>
            <Route path="save" element={<MapSaveModal />} />
            <Route path="tileList" element={<TileListModal />} />
          </Route>
          <Route
            path=":mapId/encounters/:encounterId"
            element={
              <EncounterProvider>
                <Encounter />
              </EncounterProvider>
            }
          >
            <Route path="characters">{CharacterMenuRoutes()}</Route>
            <Route path="initiative" element={<InitiativeModal />} />
            <Route path="actionQueue" element={<ActionQueueModal />} />
            <Route path="history" element={<HistoryModal />} />
            <Route path="availableActions" element={<ActionListModal />} />
            <Route path="availableReactions" element={<ActionListModal />} />
            <Route path="reset" element={<ResetModal />} />
          </Route>
        </Route>
        <Route path="encounters">
          <Route path="create" element={<EncounterForm />}>
            <Route path="" element={<EncounterFormInfo />} />
            <Route path="maps/:mapId" element={<EncounterFormMap />} />
          </Route>
          <Route path="pending" element={<EncounterList />} />
          <Route path="completed" element={<EncounterList />} />
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
