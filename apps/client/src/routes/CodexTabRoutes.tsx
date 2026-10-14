import { Route } from 'react-router-dom';
import ActionForm from 'src/components/forms/ActionForm';
import CodexSearch from 'src/components/CodexSearch';
import ConditionForm from 'src/components/forms/ConditionForm';
import ItemLinkModal from 'src/components/modals/ItemLinkModal';
import ItemForm from 'src/components/forms/ItemForm';
import Items from 'src/components/Items';
import KeywordForm from 'src/components/forms/KeywordForm';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';
import ModifierModal from 'src/components/modals/ModifierModal';
import PatchNoteForm from 'src/components/forms/PatchNotesForm';
import PerkForm from 'src/components/forms/PerkForm';
import ActionLinkModal from 'src/components/modals/ActionLinkModal';
import ItemPage from 'src/components/ItemPage';
import Properties from 'src/components/Properties';
import PropertyForm from 'src/components/forms/PropertyForm';
import CodexDashboard from 'src/components/CodexDashboard';
import CharacterForm from 'src/components/forms/CharacterForm';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import CodexCharacters from 'src/components/characterComponents/CodexCharacters';
import CharacterRoutes from './CharacterRoutes';
import GenerateStandardPictureForm from 'src/components/forms/GenerateStandardPictureForm';
import MapBuilder from 'src/components/mapComponents/mapBuilder/MapBuilder';
import MapSaveModal from 'src/components/mapComponents/mapBuilder/MapSaveModal';
import TileListModal from 'src/components/mapComponents/mapBuilder/TileListModal';
import CodexMapList from 'src/components/mapComponents/map/CodexMapList';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import Modal from 'src/components/modals/Modal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import MapPage from 'src/components/mapComponents/map/MapPage';
import PerksPage from 'src/components/PerksPage';
import KeywordsPage from 'src/components/KeywordsPage';
import ActionsPage from 'src/components/ActionsPage';
import ConditionsPage from 'src/components/ConditionsPage';

const CodexTabRoutes = () => {
  return (
    <Route path="codex">
      <Route path="dashboard" element={<CodexDashboard />} />
      <Route path="search" element={<CodexSearch />} />
      <Route path="search/:category/:itemId" element={<ItemPage />} />
      <Route path="patchNotes">
        <Route path="create" element={<PatchNoteForm />} />
        <Route path=":patchNoteId/update" element={<PatchNoteForm />} />
      </Route>
      <Route path="characters">
        <Route path="" element={<CodexCharacters />} />
        {CharacterRoutes()}
        {CharacterMenuRoutes()}
        <Route path="create" element={<CharacterForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="perks" element={<PerkLinkModal />} />
            <Route path="npcPreferences" element={<NpcPreferenceModal />} />
            <Route path="actions" element={<ActionLinkModal />} />
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
      </Route>
      <Route path="items">
        <Route path="" element={<Items />} />
        <Route path=":itemId" element={<ItemPage />} />
        <Route path="create" element={<ItemForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="traits" element={<KeywordLinkModal />} />
            <Route path="links" element={<ItemLinkModal />} />
            <Route path="actions" element={<ActionLinkModal />} />
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
        <Route path=":itemId/update" element={<ItemForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="traits" element={<KeywordLinkModal />} />
            <Route path="links" element={<ItemLinkModal />} />
            <Route path="actions" element={<ActionLinkModal />} />
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
      </Route>
      <Route path="properties">
        <Route index element={<Properties key="properties" />} />
        <Route path="create" element={<PropertyForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
        <Route path=":propertyId/update" element={<PropertyForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="library" element={<PictureLibraryModal />} />
          </Route>
        </Route>
      </Route>
      <Route path="perks">
        <Route index element={<PerksPage />} />
        <Route path="create" element={<PerkForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="modifiers" element={<ModifierModal />} />
            <Route path="actions" element={<ActionLinkModal />} />
          </Route>
        </Route>
        <Route path=":perkId/update" element={<PerkForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="modifiers" element={<ModifierModal />} />
            <Route path="actions" element={<ActionLinkModal />} />
          </Route>
        </Route>
      </Route>
      <Route path="keywords">
        <Route index element={<KeywordsPage />} />
        <Route path="create" element={<KeywordForm />} />
        <Route path=":keywordId/update" element={<KeywordForm />} />
      </Route>
      <Route path="actions">
        <Route index element={<ActionsPage />} />
        <Route path="create" element={<ActionForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="traits" element={<KeywordLinkModal />} />
            <Route path="modifiers" element={<ModifierModal />} />
          </Route>
        </Route>
        <Route path=":actionId/update" element={<ActionForm />}>
          <Route path="modal" element={<Modal />}>
            <Route path="traits" element={<KeywordLinkModal />} />
            <Route path="modifiers" element={<ModifierModal />} />
          </Route>
        </Route>
      </Route>
      <Route path="conditions">
        <Route index element={<ConditionsPage />} />
        <Route path="create" element={<ConditionForm />} />
        <Route path=":conditionId/update" element={<ConditionForm />} />
      </Route>
      <Route path="pictures/create" element={<GenerateStandardPictureForm />} />
      <Route path="maps">
        <Route index element={<CodexMapList />} />
        <Route path=":mapId" element={<MapPage />} />
        <Route path=":mapId/update" element={<MapBuilder />}>
          <Route path="create" element={<MapBuilder />}>
            <Route path="modal" element={<Modal />}>
              <Route path="save" element={<MapSaveModal />} />
              <Route path="tileList" element={<TileListModal />} />
              <Route path="library" element={<PictureLibraryModal />} />
            </Route>
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
    </Route>
  );
};

export default CodexTabRoutes;
