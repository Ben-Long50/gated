import { Route } from 'react-router-dom';
import CharacterForm from 'src/components/forms/CharacterForm';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import CharacterRoutes from './CharacterRoutes';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import CharacterDashboard from 'src/components/characterComponents/CharacterDashboard';
import Modal from 'src/components/modals/Modal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import CharacterAddPage from 'src/components/characterComponents/CharacterAddPage';

const CharacterTabRoutes = () => {
  return (
    <Route path="characters">
      <Route path="dashboard" element={<CharacterDashboard />}>
        {CharacterMenuRoutes()}
      </Route>
      <Route path="create" element={<CharacterForm />}>
        <Route path="modal" element={<Modal />}>
          <Route path="perks" element={<PerkLinkModal />} />
          <Route path="npcPreferences" element={<NpcPreferenceModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
      <Route path="addCharacter" element={<CharacterAddPage />} />
      {CharacterRoutes()}
    </Route>
  );
};

export default CharacterTabRoutes;
