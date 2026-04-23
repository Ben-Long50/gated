import { Route } from 'react-router-dom';
import AffiliationForm from 'src/components/forms/AffiliationForm';
import Cart from 'src/components/Cart';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import ConditionModal from 'src/components/modals/ConditionModal';
import Items from 'src/components/Items';
import Shop from 'src/components/Shop';
import AffiliationModal from 'src/components/modals/AffiliationModal';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import ItemPage from 'src/components/ItemPage';

const CharacterModalRoutes = () => {
  return (
    <Route path=":characterId">
      <Route path="conditions/:conditionId" element={<DescriptionModal />} />
      <Route path="conditions" element={<ConditionModal />} />
      <Route path="affiliations" element={<AffiliationModal />}>
        <Route index element={<CharacterAffiliations />} />
        <Route path="create" element={<AffiliationForm />} />
      </Route>
      <Route path="shop">
        <Route path="global" element={<Shop />}>
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />} />
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
        <Route path=":shopId" element={<Shop />}>
          <Route path="cart" element={<Cart />} />
          <Route path=":category" element={<Items />} />
          <Route path=":category/:itemId" element={<ItemPage />} />
        </Route>
      </Route>
    </Route>
  );
};

export default CharacterModalRoutes;
