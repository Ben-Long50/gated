import { Route } from 'react-router-dom';
import Campaign from 'src/components/Campaign';
import CampaignForm from 'src/components/forms/CampaignForm';
import FactionForm from 'src/components/forms/FactionForm';
import RollSimulator from 'src/components/RollSimulator';
import SessionRoutes from './SessionRoutes';
import CampaignAffiliations from 'src/components/CampaignAffiliations';
import RollModal from 'src/components/modals/RollModal';
import CalendarModal from 'src/components/modals/CalendarModal';
import EventForm from 'src/components/forms/EventForm';
import TimeModal from 'src/components/modals/TimeModal';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import DeleteModal from 'src/components/modals/DeleteModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
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
import GangForm from 'src/components/forms/GangForm';
import GangPage from 'src/components/GangPage';
import ReputationPointModal from 'src/components/ReputationPointModal';
import LevelNodeModal from 'src/components/LevelNodeModal';
import CharacterLevelsModal from 'src/components/characterComponents/CharacterLevelsModal';
import GangProfitsModal from 'src/components/GangProfitsModal';
import PlayerSelectModal from 'src/components/modals/PlayerSelectModal';
import GangCharacterSelectModal from 'src/components/GangCharacterSelectModal';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import AffiliationEntitySelectModal from 'src/components/modals/AffiliationEntitySelectModal';
import CampaignDashboard from 'src/components/CampaignDashboard';
import CharacterAddModal from 'src/components/characterComponents/CharacterAddModal';
import Modal from 'src/components/modals/Modal';
import CampaignCharacterSelectModal from 'src/components/characterComponents/CampaignCharacterSelectModal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import FactionPage from 'src/components/FactionPage';
import CampaignCharactersPage from 'src/components/characterComponents/CampaignCharactersPage';
import NotesPage from 'src/components/NotesPage';
import NotesForm from 'src/components/forms/NotesForm';
import CharacterAddPage from 'src/components/characterComponents/CharacterAddPage';
import CampaignMapsPage from 'src/components/mapComponents/map/CampaignMapsPage';
import MapPage from 'src/components/mapComponents/map/MapPage';
import CampaignGangList from 'src/components/CampaignGangList';

const CampaignTabRoutes = () => {
  return (
    <Route path="campaigns">
      <Route path="" element={<CampaignDashboard />} />
      <Route path=":campaignId">
        <Route path="dashboard" element={<Campaign />}>
          <Route path="modal" element={<Modal />}>
            <Route
              path="selectCharacter"
              element={<CampaignCharacterSelectModal />}
            />
            <Route path="characters">{CharacterMenuRoutes()}</Route>
            <Route path="time" element={<TimeModal />} />
            <Route path="date" element={<CalendarModal />} />
            <Route path="event" element={<EventForm />} />
          </Route>
          <Route path="characters">{CharacterMenuRoutes()}</Route>
        </Route>
        <Route path="update" element={<CampaignForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="managePlayers" element={<PlayerSelectModal />} />
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
        <Route path="factions/:factionId">
          <Route path="" element={<FactionPage />} />
          <Route path="update" element={<FactionForm />}>
            <Route path="modal" element={<Modal />}>
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
          </Route>
        </Route>
        <Route path="characters">
          <Route path="" element={<CampaignCharactersPage />}>
            {CharacterMenuRoutes()}
          </Route>
          <Route path=":characterId/notes" element={<NotesPage />}>
            <Route path="modal" element={<Modal />}>
              <Route path="session/:sessionId/update" element={<NotesForm />} />
            </Route>
          </Route>
        </Route>
        <Route path="characters/add" element={<CharacterAddPage />} />
        {SessionRoutes()}
        <Route path="maps">
          <Route path="" element={<CampaignMapsPage />} />
          <Route path=":mapId" element={<MapPage />} />
          <Route path=":mapId/delete" element={<DeleteModal />} />
          <Route path="create" element={<MapBuilder />}>
            <Route path="modal" element={<Modal />}>
              <Route path="save" element={<MapSaveModal />} />
              <Route path="tileList" element={<TileListModal />} />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
          </Route>
          <Route path=":mapId/update" element={<MapBuilder />}>
            <Route path="modal" element={<Modal />}>
              <Route path="save" element={<MapSaveModal />} />
              <Route path="tileList" element={<TileListModal />} />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
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
            <Route path="modal" element={<Modal />}>
              <Route path="initiative" element={<InitiativeModal />} />
              <Route path="actionQueue" element={<ActionQueueModal />} />
              <Route path="history" element={<HistoryModal />} />
              <Route path="availableActions" element={<ActionListModal />} />
              <Route path="availableReactions" element={<ActionListModal />} />
              <Route path="reset" element={<ResetModal />} />
            </Route>
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
        <Route path="affiliations/create" element={<AffiliationForm />}>
          <Route path="modal" element={<Modal />}>
            <Route
              path="selectEntities"
              element={<AffiliationEntitySelectModal />}
            />
          </Route>
        </Route>
        <Route path="rollSimulator" element={<RollSimulator />}>
          <Route path="modal" element={<Modal />}>
            <Route path="rollResults" element={<RollModal />} />
          </Route>
        </Route>
      </Route>
      <Route path=":campaignId">
        <Route path="gangs">
          <Route path="" element={<CampaignGangList />} />
          <Route path=":gangId" element={<GangPage />}>
            <Route path="modal" element={<Modal />}>
              <Route
                path="allocateReputation"
                element={<ReputationPointModal />}
              />
              <Route path="allocateNodes" element={<LevelNodeModal />} />
              <Route path="manageLevels" element={<CharacterLevelsModal />} />
              <Route path="distributeProfits" element={<GangProfitsModal />} />
              <Route
                path="manageGangCharacters"
                element={<GangCharacterSelectModal />}
              />
              <Route path="characters/add" element={<CharacterAddModal />} />
            </Route>
            <Route path="characters">{CharacterMenuRoutes()}</Route>
          </Route>
          <Route path="create" element={<GangForm />}>
            <Route path="modal" element={<Modal />}>
              <Route
                path="characterSelect"
                element={<GangCharacterSelectModal />}
              />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
          </Route>
          <Route path=":gangId/update" element={<GangForm />}>
            <Route path="modal" element={<Modal />}>
              <Route
                path="characterSelect"
                element={<GangCharacterSelectModal />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="create" element={<CampaignForm />}>
        <Route path="modal" element={<Modal />}>
          <Route path="managePlayers" element={<PlayerSelectModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
      <Route path="rollSimulator" element={<RollSimulator />}>
        <Route path="modal" element={<Modal />}>
          <Route path="rollResults" element={<RollModal />} />
        </Route>
      </Route>
    </Route>
  );
};

export default CampaignTabRoutes;
