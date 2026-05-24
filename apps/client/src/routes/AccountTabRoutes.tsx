import { Route } from 'react-router-dom';
import AccountPreferences from 'src/components/AccountPreferences';
import AccountSettingsForm from 'src/components/AccountSettingsForm';
import ErrorReport from 'src/components/ErrorReport';
import ErrorReports from 'src/components/ErrorReports';
import Notifications from 'src/components/Notifications';
import PatchNoteForm from 'src/components/forms/PatchNotesForm';
import UserRoles from 'src/components/UserRoles';
import Page from 'src/components/Page';
import AccountInfo from 'src/components/AccountInfo';
import UserRoleForm from 'src/components/forms/UserRoleForm';

const AccountTabRoutes = () => {
  return (
    <Route path="account/:userId">
      <Route
        index
        element={
          <Page title="Account Info">
            <AccountInfo />
          </Page>
        }
      />
      <Route
        path="update"
        element={
          <Page title="Update Account Info">
            <AccountSettingsForm />
          </Page>
        }
      />
      <Route
        path="notifications"
        element={
          <Page title="Notifications">
            <Notifications />
          </Page>
        }
      />
      <Route
        path="preferences"
        element={
          <Page title="Account Preferences">
            <AccountPreferences />
          </Page>
        }
      />
      <Route
        path="adminTools"
        element={
          <Page title="Error Reports">
            <ErrorReports />
          </Page>
        }
      />
      <Route
        path="userPermissions"
        element={
          <Page title="Manage User Roles">
            <UserRoleForm />
          </Page>
        }
      />
      <Route
        path="errorReport"
        element={
          <Page title="Create Error Report">
            <ErrorReport />
          </Page>
        }
      />
      <Route path="patchNotes">
        <Route
          path="create"
          element={
            <Page title="Create Patch Note">
              <PatchNoteForm />
            </Page>
          }
        />
      </Route>
    </Route>
  );
};

export default AccountTabRoutes;
