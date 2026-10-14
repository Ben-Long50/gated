import { Route } from 'react-router-dom';
import AccountPreferences from 'src/components/AccountPreferences';
import AccountSettingsForm from 'src/components/AccountSettingsForm';
import ErrorReport from 'src/components/ErrorReport';
import ErrorReports from 'src/components/ErrorReports';
import Notifications from 'src/components/Notifications';
import PatchNoteForm from 'src/components/forms/PatchNotesForm';
import AccountInfo from 'src/components/AccountInfo';
import UserRoleForm from 'src/components/forms/UserRoleForm';
import GenerationLibrary from 'src/components/GenerationLibrary';

const AccountTabRoutes = () => {
  return (
    <Route path="account/:userId">
      <Route index element={<AccountInfo />} />
      <Route path="update" element={<AccountSettingsForm />} />
      <Route path="generations" element={<GenerationLibrary />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="preferences" element={<AccountPreferences />} />
      <Route path="adminTools" element={<ErrorReports />} />
      <Route path="userPermissions" element={<UserRoleForm />} />
      <Route path="errorReport" element={<ErrorReport />} />
      <Route path="patchNotes">
        <Route path="create" element={<PatchNoteForm />} />
      </Route>
    </Route>
  );
};

export default AccountTabRoutes;
