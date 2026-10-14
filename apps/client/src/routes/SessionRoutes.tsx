import { Route } from 'react-router-dom';
import Session from 'src/components/Session';
import SessionForm from 'src/components/forms/SessionForm';
import CharacterSelectModal from 'src/components/characterComponents/CharacterSelectModal';
import CharacterMenuRoutes from './CharacterMenuRoutes';
import Modal from 'src/components/modals/Modal';

const SessionRoutes = () => {
  return (
    <Route path="sessions">
      <Route path=":sessionId">
        <Route path="dashboard" element={<Session />} />
        <Route path="update" element={<SessionForm />}>
          <Route path="sessionCharacters" element={<CharacterSelectModal />} />
        </Route>
        <Route path="characters">{CharacterMenuRoutes()}</Route>
      </Route>
      <Route path="create" element={<SessionForm />}>
        <Route path="modal" element={<Modal />}>
          <Route path="sessionCharacters" element={<CharacterSelectModal />} />
        </Route>
      </Route>
    </Route>
  );
};

export default SessionRoutes;
