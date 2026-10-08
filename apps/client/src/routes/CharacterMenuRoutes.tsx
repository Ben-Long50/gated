import { Route } from 'react-router-dom';
import Cart from 'src/components/Cart';
import CharacterSheet from 'src/components/characterComponents/CharacterSheet';
import Equipment from 'src/components/Equipment';
import Resume from 'src/components/Resume';
import ConditionModal from 'src/components/modals/ConditionModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import ItemPage from 'src/components/ItemPage';
import Inventory from 'src/components/Inventory';
import Modal from 'src/components/modals/Modal';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import Shop from 'src/components/Shop';

const CharacterMenuRoutes = () => {
  return (
    <Route path="modal" element={<Modal />}>
      <Route path=":characterId">
        <Route path="" element={<CharacterSheet />} />
        <Route path="conditions" element={<ConditionModal />} />
        <Route path="cart" element={<Cart />} />
        <Route path="resume" element={<Resume />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="equipment/inventory" element={<Inventory />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="equipment/items/:itemId" element={<ItemPage />} />
        <Route path="inventory/items/:itemId" element={<ItemPage />} />
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
        <Route path="affiliations">
          <Route path="" element={<CharacterAffiliations />} />
          <Route path="create" element={<AffiliationForm />} />
        </Route>
        <Route path="shop">
          <Route index element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="items/:itemId" element={<ItemPage />} />
        </Route>
      </Route>
    </Route>
  );
};

export default CharacterMenuRoutes;
