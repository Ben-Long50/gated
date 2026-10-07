import { Route } from 'react-router-dom';
import CharacterForm from 'src/components/forms/CharacterForm';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import CharacterRoutes from './CharacterRoutes';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import CharacterDashboard from 'src/components/characterComponents/CharacterDashboard';
import Page from 'src/components/Page';
import PictureRoutes from './PictureRoutes';
import ActionLinkModal from 'src/components/modals/ActionLinkModal';
import CharacterAddModal from 'src/components/characterComponents/CharacterAddModal';
import Modal from 'src/components/modals/Modal';

const CharacterTabRoutes = () => {
  return (
    <Route path="characters">
      <Route path="" element={<CharacterDashboard />}>
        {CharacterMenuRoutes()}
      </Route>
      <Route
        path="create"
        element={
          <Page title="Create Character">
            <CharacterForm />
          </Page>
        }
      >
        {PictureRoutes()}
        <Route path="modal" element={<Modal />}>
          <Route path="perks" element={<PerkLinkModal />} />
          <Route path="npcPreferences" element={<NpcPreferenceModal />} />
          <Route path="actions" element={<ActionLinkModal />} />
        </Route>
      </Route>
      <Route path="modal" element={<Modal />}>
        <Route path="add" element={<CharacterAddModal />} />
      </Route>
      {CharacterRoutes()}
    </Route>
  );
};

export default CharacterTabRoutes;
