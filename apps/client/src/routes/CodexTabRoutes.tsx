import { Route, useSearchParams } from 'react-router-dom';
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

const CodexTabRoutes = () => {
  return (
    <Route path="codex">
      <Route index element={<CodexDashboard />} />
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
            <Page title="Create Item">
              <ItemForm />
            </Page>
          }
        >
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
            <Page title="Create Property">
              <PropertyForm />
            </Page>
          }
        />
        <Route
          path=":propertyId/update"
          element={
            <Page title="Update Property">
              <PropertyForm />
            </Page>
          }
        />
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
            <Page title="Create Perk">
              <PerkForm />
            </Page>
          }
        >
          <Route path="modifiers" element={<ModifierModal />} />
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
            <Page title="Create Trait">
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
            <Page title="Create Action">
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
            <Page title="Create Condition">
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
    </Route>
  );
};

export default CodexTabRoutes;
