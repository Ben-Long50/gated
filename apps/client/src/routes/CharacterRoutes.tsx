import { Route } from 'react-router-dom';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import Cart from 'src/components/Cart';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import CharacterSheet from 'src/components/characterComponents/CharacterSheet';
import CharacterUpdateForm from 'src/components/forms/CharacterUpdateForm';
import Equipment from 'src/components/Equipment';
import Inventory from 'src/components/Inventory';
import ItemUpgradeForm from 'src/components/forms/ItemUpgradeForm';
import Resume from 'src/components/Resume';
import ResumeForm from 'src/components/forms/ResumeForm';
import InventoryModal from 'src/components/modals/InventoryModal';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';
import ConditionModal from 'src/components/modals/ConditionModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Shop from 'src/components/Shop';
import Items from 'src/components/Items';
import AffiliationModal from 'src/components/modals/AffiliationModal';
import Modal from 'src/components/modals/Modal';
import ItemPage from 'src/components/ItemPage';
import LevelBonusModal from 'src/components/LevelBonusModal';
import Page from 'src/components/Page';
import CharacterProgressionPage from 'src/components/characterComponents/CharacterProgressionPage';
import PictureRoutes from './PictureRoutes';
import ItemForm from 'src/components/forms/ItemForm';
import InventoryModalRoutes from './InventoryModalRoutes';
import InventoryRoutes from './InventoryRoutes';

const CharacterRoutes = () => {
  return (
    <Route path=":characterId">
      <Route
        path=""
        element={
          <Page title="Character Sheet">
            <CharacterSheet />
          </Page>
        }
      >
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
      </Route>
      <Route
        path="progression"
        element={
          <Page title="Progression">
            <CharacterProgressionPage />
          </Page>
        }
      >
        <Route path="modal" element={<Modal />}>
          <Route path="levelBonus" element={<LevelBonusModal />} />
        </Route>
      </Route>
      <Route path="conditions" element={<ConditionModal />} />
      <Route path="affiliations" element={<CharacterAffiliations />} />
      <Route path="cart" element={<Cart />} />
      <Route path="shop">
        <Route
          path="global"
          element={
            <Page title="Shop">
              <Shop />
            </Page>
          }
        >
          <Route path="cart" element={<Cart />} />
          <Route path="items/:itemId" element={<ItemPage />} />
        </Route>
        <Route
          path=":shopId"
          element={
            <Page title="Shop">
              <Shop />
            </Page>
          }
        >
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />} />
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
      </Route>
      <Route
        path="update"
        element={
          <Page title="Update Character">
            <CharacterUpdateForm />
          </Page>
        }
      >
        {PictureRoutes()}
        <Route path="modal" element={<Modal />}>
          <Route path="levelBonus" element={<LevelBonusModal />} />
          <Route path="npcPreferences" element={<NpcPreferenceModal />} />
        </Route>
      </Route>
      <Route
        path="resume"
        element={
          <Page title="Resume">
            <Resume />
          </Page>
        }
      />
      <Route
        path="resume/update"
        element={
          <Page title="Update Resume">
            <ResumeForm />
          </Page>
        }
      />
      <Route
        path="equipment"
        element={
          <Page title="Equipment">
            <Equipment />
          </Page>
        }
      >
        {InventoryModalRoutes()}
      </Route>
      <Route
        path="drones"
        element={
          <Page title="Drones">
            <Items />
          </Page>
        }
      />
      <Route
        path="vehicles"
        element={
          <Page title="Vehicles">
            <Items />
          </Page>
        }
      />
      {InventoryRoutes()}
    </Route>
  );
};

export default CharacterRoutes;
