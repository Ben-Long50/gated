import { Route } from 'react-router-dom';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import Cart from 'src/components/Cart';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import CharacterSheet from 'src/components/characterComponents/CharacterSheet';
import Equipment from 'src/components/Equipment';
import Resume from 'src/components/Resume';
import ResumeForm from 'src/components/forms/ResumeForm';
import InventoryModal from 'src/components/modals/InventoryModal';
import ConditionModal from 'src/components/modals/ConditionModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Shop from 'src/components/Shop';
import Items from 'src/components/Items';
import AffiliationModal from 'src/components/modals/AffiliationModal';
import Modal from 'src/components/modals/Modal';
import ItemPage from 'src/components/ItemPage';
import BtnRect from 'src/components/buttons/BtnRect';

const CharacterMenuRoutes = () => {
  return (
    <Route path=":characterId/menu">
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
        <Route
          path="global"
          element={
            <Modal>
              <Shop />
            </Modal>
          }
        >
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />}>
            <Route path="traits/:traitId" element={<DescriptionModal />} />
          </Route>
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
        <Route
          path=":shopId"
          element={
            <Modal>
              <Shop />
            </Modal>
          }
        >
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />}>
            <Route path="traits/:traitId" element={<DescriptionModal />} />
          </Route>
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
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
      />
      <Route path="equipment/inventory" element={<InventoryModal />} />
      <Route path="inventory" element={<InventoryModal />} />
      <Route
        path="equipment/items/:itemId"
        element={
          <Modal>
            <ItemPage />
          </Modal>
        }
      />
      <Route
        path="inventory/items/:itemId"
        element={
          <Modal>
            <ItemPage />
          </Modal>
        }
      />
    </Route>
  );
};

export default CharacterMenuRoutes;
