import { Route } from 'react-router-dom';
import CharacterForm from 'src/components/forms/CharacterForm';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import CharacterRoutes from './CharacterRoutes';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import CharacterDashboard from 'src/components/CharacterDashboard';

const CharacterTabRoutes = () => {
  return (
    <Route path="characters">
      <Route path="" element={<CharacterDashboard />}>
        {CharacterMenuRoutes()}
      </Route>
      <Route path="create" element={<CharacterForm />}>
        <Route path="perks" element={<PerkLinkModal />} />
        <Route path="npcPreferences" element={<NpcPreferenceModal />} />
      </Route>
      {CharacterRoutes()}
    </Route>
  );
};

export default CharacterTabRoutes;
