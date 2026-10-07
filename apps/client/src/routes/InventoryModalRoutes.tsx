import { Route } from 'react-router-dom';
import ItemForm from 'src/components/forms/ItemForm';
import ItemUpgradeForm from 'src/components/forms/ItemUpgradeForm';
import Inventory from 'src/components/Inventory';
import ItemPage from 'src/components/ItemPage';
import ConditionModal from 'src/components/modals/ConditionModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';
import Modal from 'src/components/modals/Modal';

const InventoryModalRoutes = () => {
  return (
    <Route path="modal" element={<Modal />}>
      <Route path="inventory" element={<Inventory />} />
      <Route path="inventory/items/:itemId">
        <Route path="" element={<ItemPage />} />
        <Route path=":itemId/conditions" element={<ConditionModal />} />
        <Route path="traits/:traitId" element={<DescriptionModal />} />
        <Route path="conditions/:conditionId" element={<DescriptionModal />} />
        <Route path="update" element={<ItemForm />} />
        <Route path="upgrade" element={<ItemUpgradeForm />}>
          <Route path="traits" element={<KeywordLinkModal />} />
        </Route>
      </Route>
    </Route>
  );
};

export default InventoryModalRoutes;
