import { Route } from 'react-router-dom';
import ActionForm from 'src/components/forms/ActionForm';
import Actions from 'src/components/Actions';
import CodexSearch from 'src/components/CodexSearch';
import ConditionForm from 'src/components/forms/ConditionForm';
import Conditions from 'src/components/Conditions';
import ItemLinkModal from 'src/components/modals/ItemLinkModal';
import ItemForm from 'src/components/forms/ItemForm';
import Items from 'src/components/Items';
import KeywordForm from 'src/components/forms/KeywordForm';
import Keywords from 'src/components/Keywords';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';
import ModifierModal from 'src/components/modals/ModifierModal';
import PatchNoteForm from 'src/components/forms/PatchNotesForm';
import PerkForm from 'src/components/forms/PerkForm';
import Perks from 'src/components/Perks';
import ActionLinkModal from 'src/components/modals/ActionLinkModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import ItemPage from 'src/components/ItemPage';
import Properties from 'src/components/Properties';
import PropertyForm from 'src/components/forms/PropertyForm';
import CodexDashboard from 'src/components/CodexDashboard';
import Page from 'src/components/Page';
import PictureRoutes from './PictureRoutes';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import CharacterForm from 'src/components/forms/CharacterForm';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import CodexCharacters from 'src/components/characterComponents/CodexCharacters';
import PromptModal from 'src/components/modals/PromptModal';
import CharacterRoutes from './CharacterRoutes';
import GenerateStandardPictureForm from 'src/components/forms/GenerateStandardPictureForm';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import Map from 'src/components/mapComponents/map/Map';
import MapList from 'src/components/mapComponents/map/MapList';
import MapTabRoutes from './MapTabRoutes';
import CodexMapList from 'src/components/mapComponents/map/CodexMapList';
import CharacterMenuRoutes from './CharacterMenuRoutes';

const CodexTabRoutes = () => {
  return (
    <Route path="codex">
      <Route
        index
        element={
          <Page title="Codex">
            <CodexDashboard />
          </Page>
        }
      />
      <Route
        path="search"
        element={
          <Page title="Search Codex">
            <CodexSearch />
          </Page>
        }
      />
      <Route path="search/:category/:itemId" element={<ItemPage />} />
      <Route path="patchNotes">
        <Route path="create" element={<PatchNoteForm />} />
        <Route path=":patchNoteId/update" element={<PatchNoteForm />} />
      </Route>
      <Route path="characters">
        <Route
          path=""
          element={
            <Page title="Characters">
              <CodexCharacters />
            </Page>
          }
        />
        {CharacterRoutes()}
        {CharacterMenuRoutes()}
        <Route
          path="create"
          element={
            <Page title="Create Codex Character">
              <CharacterForm />
            </Page>
          }
        >
          {PictureRoutes()}
          <Route path="perks" element={<PerkLinkModal />} />
          <Route path="npcPreferences" element={<NpcPreferenceModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
      </Route>
      <Route path="items">
        <Route
          path=""
          element={
            <Page title="Items">
              <Items />
            </Page>
          }
        >
          <Route
            path="conditions/:conditionId"
            element={<DescriptionModal />}
          />
          <Route path="traits/:traitId" element={<DescriptionModal />} />
        </Route>
        <Route
          path=":itemId"
          element={
            <Page>
              <ItemPage />
            </Page>
          }
        >
          <Route
            path="conditions/:conditionId"
            element={<DescriptionModal />}
          />
          <Route path="traits/:traitId" element={<DescriptionModal />} />
        </Route>

        <Route
          path="create"
          element={
            <Page title="Create Codex Item">
              <ItemForm />
            </Page>
          }
        >
          <Route path="library" element={<PictureLibraryModal />} />
          <Route path="prompt" element={<PromptModal />} />
          <Route path="traits" element={<KeywordLinkModal />} />
          <Route path="links" element={<ItemLinkModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
        <Route
          path=":itemId/update"
          element={
            <Page title="Update Item">
              <ItemForm />
            </Page>
          }
        >
          <Route path="library" element={<PictureLibraryModal />} />
          <Route path="prompt" element={<PromptModal />} />
          <Route path="traits" element={<KeywordLinkModal />} />
          <Route path="links" element={<ItemLinkModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
      </Route>
      <Route path="properties">
        <Route
          index
          element={
            <Page title="Properties">
              <Properties key="properties" />
            </Page>
          }
        />
        <Route
          path="create"
          element={
            <Page title="Create Codex Property">
              <PropertyForm />
            </Page>
          }
        >
          <Route path="library" element={<PictureLibraryModal />} />
          <Route path="prompt" element={<PromptModal />} />
        </Route>
        <Route
          path=":propertyId/update"
          element={
            <Page title="Update Property">
              <PropertyForm />
            </Page>
          }
        >
          <Route path="library" element={<PictureLibraryModal />} />
          <Route path="prompt" element={<PromptModal />} />
        </Route>
      </Route>
      <Route path="perks">
        <Route
          index
          element={
            <Page title="Perks">
              <Perks />
            </Page>
          }
        />
        <Route
          path="create"
          element={
            <Page title="Create Codex Perk">
              <PerkForm />
            </Page>
          }
        >
          <Route path="modifiers" element={<ModifierModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
        <Route
          path=":perkId/update"
          element={
            <Page title="Update Perk">
              <PerkForm />
            </Page>
          }
        >
          <Route path="modifiers" element={<ModifierModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
      </Route>
      <Route path="keywords">
        <Route
          index
          element={
            <Page title="Traits">
              <Keywords />
            </Page>
          }
        />
        <Route
          path="create"
          element={
            <Page title="Create Codex Trait">
              <KeywordForm />
            </Page>
          }
        />
        <Route
          path=":keywordId/update"
          element={
            <Page title="Update Trait">
              <KeywordForm />
            </Page>
          }
        />
      </Route>
      <Route path="actions">
        <Route
          index
          element={
            <Page title="Actions">
              <Actions />
            </Page>
          }
        />
        <Route
          path="create"
          element={
            <Page title="Create Codex Action">
              <ActionForm />
            </Page>
          }
        >
          <Route path="traits" element={<KeywordLinkModal />} />
          <Route path="modifiers" element={<ModifierModal />} />
        </Route>
        <Route
          path=":actionId/update"
          element={
            <Page title="Update Action">
              <ActionForm />
            </Page>
          }
        >
          <Route path="traits" element={<KeywordLinkModal />} />
          <Route path="modifiers" element={<ModifierModal />} />
        </Route>
      </Route>
      <Route path="conditions">
        <Route
          index
          element={
            <Page title="Conditions">
              <Conditions />
            </Page>
          }
        />
        <Route
          path="create"
          element={
            <Page title="Create Codex Condition">
              <ConditionForm />
            </Page>
          }
        />
        <Route
          path=":conditionId/update"
          element={
            <Page title="Update Condition">
              <ConditionForm />
            </Page>
          }
        />
      </Route>
      <Route
        path="pictures/create"
        element={
          <Page title="Generate Standard Picture">
            <GenerateStandardPictureForm />
          </Page>
        }
      />
      <Route path="maps">
        <Route
          path=""
          element={
            <Page title="Maps">
              <CodexMapList />
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
    </Route>
  );
};

export default CodexTabRoutes;
