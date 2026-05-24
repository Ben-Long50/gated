import { Route } from 'react-router-dom';
import Cart from 'src/components/Cart';
import CharacterSheet from 'src/components/characterComponents/CharacterSheet';
import CharacterUpdateForm from 'src/components/forms/CharacterUpdateForm';
import Notes from 'src/components/Notes';
import NotesForm from 'src/components/forms/NotesForm';
import Resume from 'src/components/Resume';
import ResumeForm from 'src/components/forms/ResumeForm';
import Session from 'src/components/Session';
import SessionForm from 'src/components/forms/SessionForm';
import CharacterSelectModal from 'src/components/characterComponents/CharacterSelectModal';
import Page from 'src/components/Page';
import CharacterMenuRoutes from './CharacterMenuRoutes';

const SessionRoutes = () => {
  return (
    <Route path="sessions">
      <Route path=":sessionId">
        <Route
          index
          element={
            <Page title="Session">
              <Session />
            </Page>
          }
        />
        <Route
          path="update"
          element={
            <Page title="Update Session">
              <SessionForm />
            </Page>
          }
        >
          <Route path="sessionCharacters" element={<CharacterSelectModal />} />
        </Route>
        <Route path="characters">{CharacterMenuRoutes()}</Route>
      </Route>
      <Route path="create" element={<SessionForm />}>
        <Route path="sessionCharacters" element={<CharacterSelectModal />} />
      </Route>
    </Route>
  );
};

export default SessionRoutes;
