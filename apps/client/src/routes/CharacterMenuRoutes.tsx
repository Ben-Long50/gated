import { Route } from 'react-router-dom';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import Cart from 'src/components/Cart';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import CharacterSheet from 'src/components/CharacterSheet';
import CharacterUpdateForm from 'src/components/forms/CharacterUpdateForm';
import Deployments from 'src/components/Deployments';
import Equipment from 'src/components/Equipment';
import Inventory from 'src/components/Inventory';
import ItemUpgradeForm from 'src/components/forms/ItemUpgradeForm';
import Resume from 'src/components/Resume';
import ResumeForm from 'src/components/forms/ResumeForm';
import InventoryModal from 'src/components/modals/InventoryModal';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import PerkLinkModal from 'src/components/modals/PerkLinkModal';
import ItemUpgradeTutorialModal from 'src/components/modals/tutorials/ItemUpgradeTutorialModal';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';
import ItemUpdateModal from 'src/components/modals/ItemUpdateModal';
import ConditionModal from 'src/components/modals/ConditionModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import ShopModal from 'src/components/modals/ShopModal';
import Items from 'src/components/Items';
import AffiliationModal from 'src/components/modals/AffiliationModal';
import Modal from 'src/components/modals/Modal';
import ItemPage from 'src/components/ItemPage';

const CharacterMenuRoutes = () => {
  return (
    <Route path=":characterId">
      <Route
        path=""
        element={
          <Modal>
            <CharacterSheet />
          </Modal>
        }
      >
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
      </Route>
      <Route path="conditions" element={<ConditionModal />} />
      <Route path="affiliations" element={<AffiliationModal />}>
        <Route index element={<CharacterAffiliations />} />
        <Route path="create" element={<AffiliationForm />} />
      </Route>
      <Route path="shop">
        <Route path="global" element={<ShopModal />}>
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />}>
            <Route path="traits/:traitId" element={<DescriptionModal />} />
          </Route>
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
        <Route path=":shopId" element={<ShopModal />}>
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />}>
            <Route path="traits/:traitId" element={<DescriptionModal />} />
          </Route>
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
      </Route>
      <Route
        path="update"
        element={
          <Modal>
            <CharacterUpdateForm />
          </Modal>
        }
      >
        <Route path="perks" element={<PerkLinkModal />} />
        <Route path="npcPreferences" element={<NpcPreferenceModal />} />
      </Route>
      <Route path="cart" element={<Cart />} />
      <Route
        path="resume"
        element={
          <Modal>
            <Resume />
          </Modal>
        }
      />
      <Route
        path="resume/update"
        element={
          <Modal>
            <ResumeForm />
          </Modal>
        }
      />
      <Route
        path="equipment"
        element={
          <Modal>
            <Equipment />
          </Modal>
        }
      >
        <Route path="inventory" element={<InventoryModal />} />
        <Route
          path=":category/:itemId/conditions"
          element={<ConditionModal />}
        />
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
        <Route path="traits/:traitId" element={<DescriptionModal />} />
      </Route>
      <Route
        path="deployments"
        element={
          <Modal>
            <Deployments />
          </Modal>
        }
      >
        <Route path="inventory" element={<InventoryModal />} />
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
        <Route path="traits/:traitId" element={<DescriptionModal />} />
      </Route>
      <Route path="inventory">
        <Route path=":category">
          <Route path=":itemId/conditions" element={<ConditionModal />} />
          <Route path="" element={<Inventory />}>
            <Route path="traits/:traitId" element={<DescriptionModal />} />
            <Route
              path="conditions/:conditionId"
              element={<DescriptionModal />}
            />
          </Route>
          <Route
            path=":itemId"
            element={
              <Modal>
                <ItemPage />
              </Modal>
            }
          >
            <Route path="update" element={<ItemUpdateModal />} />
            <Route
              path="conditions/:conditionId"
              element={<DescriptionModal />}
            />
            <Route path="traits/:traitId" element={<DescriptionModal />} />
          </Route>
          <Route
            path=":itemId/upgrade"
            element={
              <Modal>
                <ItemUpgradeForm />
              </Modal>
            }
          >
            <Route path="traits" element={<KeywordLinkModal />} />
            <Route path="tutorial" element={<ItemUpgradeTutorialModal />} />
          </Route>
        </Route>
      </Route>
    </Route>
  );
};

export default CharacterMenuRoutes;
