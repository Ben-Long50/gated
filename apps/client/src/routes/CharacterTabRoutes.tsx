import { Route } from 'react-router-dom';
import CharacterForm from 'src/components/forms/CharacterForm';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import CharacterRoutes from './CharacterRoutes';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import CharacterDashboard from 'src/components/CharacterDashboard';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import Page from 'src/components/Page';

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
        <Route path="library" element={<PictureLibraryModal />} />
        <Route path="perks" element={<PerkLinkModal />} />
        <Route path="npcPreferences" element={<NpcPreferenceModal />} />
      </Route>
      {CharacterRoutes()}
    </Route>
  );
};

export default CharacterTabRoutes;
