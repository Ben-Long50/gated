import { Route } from 'react-router-dom';
import Campaign from 'src/components/Campaign';
import CampaignForm from 'src/components/forms/CampaignForm';
import Faction from 'src/components/Faction';
import FactionForm from 'src/components/forms/FactionForm';
import RollSimulator from 'src/components/RollSimulator';
import SessionRoutes from './SessionRoutes';
import CampaignAffiliations from 'src/components/CampaignAffiliations';
import RollModal from 'src/components/modals/RollModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Notes from 'src/components/Notes';
import CalendarModal from 'src/components/modals/CalendarModal';
import EventForm from 'src/components/forms/EventForm';
import TimeModal from 'src/components/modals/TimeModal';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
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
import GangForm from 'src/components/forms/GangForm';
import Gangs from 'src/components/Gangs';
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
import Page from 'src/components/Page';
import CampaignMapList from 'src/components/mapComponents/map/CampaignMapList';
import CharacterAddModal from 'src/components/characterComponents/CharacterAddModal';
import CampaignCharacters from 'src/components/characterComponents/CampaignCharacters';
import Modal from 'src/components/modals/Modal';
import CampaignCharacterSelectModal from 'src/components/characterComponents/CampaignCharacterSelectModal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';

const CampaignTabRoutes = () => {
  return (
    <Route path="campaigns">
      <Route
        path=""
        element={
          <Page title="Campaigns">
            <CampaignDashboard />
          </Page>
        }
      />
      <Route path=":campaignId">
        <Route
          path="dashboard"
          element={
            <Page title="Campaign">
              <Campaign />
            </Page>
          }
        >
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
          <Route
            path="conditions/:conditionId"
            element={<DescriptionModal />}
          />
        </Route>
        <Route
          path="update"
          element={
            <Page title="Update Campaign">
              <CampaignForm />
            </Page>
          }
        >
          <Route path="modal" element={<Modal />}>
            <Route path="managePlayers" element={<PlayerSelectModal />} />
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
        <Route path="factions/:factionId">
          <Route
            index
            element={
              <Page title="Faction">
                <Faction />
              </Page>
            }
          />
          <Route
            path="update"
            element={
              <Page title="Update Faction">
                <FactionForm />
              </Page>
            }
          />
        </Route>
        <Route path="characters">
          <Route
            path=""
            element={
              <Page title="Campaign Characters">
                <CampaignCharacters />
              </Page>
            }
          >
            {CharacterMenuRoutes()}
          </Route>
          <Route
            path=":characterId/notes"
            element={
              <Page title="Notes">
                <Notes />
              </Page>
            }
          />
        </Route>
        <Route path="modal" element={<Modal />}>
          <Route path="characters/add" element={<CharacterAddModal />} />
        </Route>

        {SessionRoutes()}
        <Route path="maps">
          <Route
            path=""
            element={
              <Page title="Campaign Maps">
                <CampaignMapList />
              </Page>
            }
          />
          <Route
            path=":mapId"
            element={
              <Page title="Map">
                <Map />
              </Page>
            }
          >
            <Route path="characters">{CharacterMenuRoutes()}</Route>
          </Route>
          <Route path=":mapId/delete" element={<DeleteModal />} />
          <Route path="create" element={<MapBuilder />}>
            <Route path="modal" element={<Modal />}>
              <Route path="save" element={<MapSaveModal />} />
              <Route path="tileList" element={<TileListModal />} />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
          </Route>
          <Route
            path=":mapId/update"
            element={
              <Page title="Update Map">
                <MapBuilder />
              </Page>
            }
          >
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
          <Route
            path="create"
            element={
              <Page title="Create Encounter">
                <EncounterForm />
              </Page>
            }
          >
            <Route path="" element={<EncounterFormInfo />} />
            <Route path="maps/:mapId" element={<EncounterFormMap />} />
          </Route>
          <Route
            path="pending"
            element={
              <Page title="Pending Encounters">
                <EncounterList />
              </Page>
            }
          />
          <Route
            path="completed"
            element={
              <Page title="Completed Encounters">
                <EncounterList />
              </Page>
            }
          />
        </Route>
        <Route
          path="affiliations"
          element={
            <Page title="Campaign Affiliations">
              <CampaignAffiliations />
            </Page>
          }
        />
        <Route
          path="affiliations/create"
          element={
            <Page title="Create Affiliation">
              <AffiliationForm />
            </Page>
          }
        >
          <Route path="modal" element={<Modal />}>
            <Route
              path="selectEntities"
              element={<AffiliationEntitySelectModal />}
            />
          </Route>
        </Route>
        <Route
          path="rollSimulator"
          element={
            <Page title="Roll Simulator">
              <RollSimulator />
            </Page>
          }
        >
          <Route path="modal" element={<Modal />}>
            <Route path="rollResults" element={<RollModal />} />
          </Route>
        </Route>
      </Route>
      <Route path=":campaignId">
        <Route path="gangs">
          <Route
            path=""
            element={
              <Page title="Campaign Gangs">
                <Gangs />
              </Page>
            }
          />
          <Route
            path=":gangId"
            element={
              <Page title="Gang">
                <GangPage />
              </Page>
            }
          >
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
          <Route
            path="create"
            element={
              <Page title="Create Gang">
                <GangForm />
              </Page>
            }
          >
            <Route path="modal" element={<Modal />}>
              <Route
                path="characterSelect"
                element={<GangCharacterSelectModal />}
              />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
          </Route>
          <Route
            path=":gangId/update"
            element={
              <Page title="Update Gang">
                <GangForm />
              </Page>
            }
          >
            <Route path="modal" element={<Modal />}>
              <Route
                path="characterSelect"
                element={<GangCharacterSelectModal />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route
        path="create"
        element={
          <Page title="Create Campaign">
            <CampaignForm />
          </Page>
        }
      >
        <Route path="modal" element={<Modal />}>
          <Route path="managePlayers" element={<PlayerSelectModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
      <Route
        path="rollSimulator"
        element={
          <Page title="Roll Simulator">
            <RollSimulator />
          </Page>
        }
      >
        <Route path="modal" element={<Modal />}>
          <Route path="rollResults" element={<RollModal />} />
        </Route>
      </Route>
    </Route>
  );
};

export default CampaignTabRoutes;
