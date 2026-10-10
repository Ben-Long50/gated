import { Route } from 'react-router-dom';
import Cart from 'src/components/Cart';
import CharacterAffiliations from 'src/components/CharacterAffiliations';
import CharacterUpdateForm from 'src/components/forms/CharacterUpdateForm';
import Equipment from 'src/components/Equipment';
import Resume from 'src/components/Resume';
import ResumeForm from 'src/components/forms/ResumeForm';
import NpcPreferenceModal from 'src/components/modals/NpcPreferenceModal';
import ConditionModal from 'src/components/modals/ConditionModal';
import Items from 'src/components/Items';
import Modal from 'src/components/modals/Modal';
import ItemPage from 'src/components/ItemPage';
import LevelBonusModal from 'src/components/LevelBonusModal';
import Page from 'src/components/Page';
import CharacterProgressionPage from 'src/components/characterComponents/CharacterProgressionPage';
import InventoryModalRoutes from './InventoryModalRoutes';
import BulkItemForm from 'src/components/forms/BulkItemForm';
import ShopPage from 'src/components/ShopPage';
import CharacterSheetPage from 'src/components/characterComponents/CharacterSheetPage';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import Inventory from 'src/components/Inventory';
import ItemForm from 'src/components/forms/ItemForm';
import ItemUpgradeForm from 'src/components/forms/ItemUpgradeForm';
import KeywordLinkModal from 'src/components/modals/KeywordLinkModal';

const CharacterRoutes = () => {
  return (
    <Route path=":characterId">
      <Route path="" element={<CharacterSheetPage />}>
        <Route path="modal" element={<Modal />}>
          <Route path="resume" element={<Resume />} />
          <Route path="resume/update" element={<ResumeForm />} />
        </Route>
      </Route>
      <Route path="progression" element={<CharacterProgressionPage />}>
        <Route path="modal" element={<Modal />}>
          <Route path="levelBonus" element={<LevelBonusModal />} />
        </Route>
      </Route>
      <Route path="conditions" element={<ConditionModal />} />
      <Route path="affiliations" element={<CharacterAffiliations />} />
      <Route path="shop">
        <Route path="global" element={<ShopPage />}>
          <Route path="modal" element={<Modal />}>
            <Route path="cart" element={<Cart />} />
            <Route path="bulk" element={<BulkItemForm />} />
            <Route path="items/:itemId" element={<ItemPage />} />
            {InventoryModalRoutes()}
          </Route>
        </Route>
      </Route>
      <Route path="update" element={<CharacterUpdateForm />}>
        <Route path="modal" element={<Modal />}>
          <Route path="levelBonus" element={<LevelBonusModal />} />
          <Route path="npcPreferences" element={<NpcPreferenceModal />} />
          <Route path="library" element={<PictureLibraryModal />} />
        </Route>
      </Route>
      <Route
        path="equipment"
        element={
          <Page title="Equipment">
            <Equipment />
          </Page>
        }
      >
        <Route path="modal" element={<Modal />}>
          {InventoryModalRoutes()}
        </Route>
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
      <Route
        path="inventory"
        element={
          <Page title="Inventory">
            <Inventory />
          </Page>
        }
      >
        <Route path="modal" element={<Modal />}>
          <Route path="items/:itemId">
            <Route path="" element={<ItemPage />} />
            <Route path=":itemId/conditions" element={<ConditionModal />} />
            <Route path="update" element={<ItemForm />} />
            <Route path="upgrade" element={<ItemUpgradeForm />}>
              <Route path="traits" element={<KeywordLinkModal />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  );
};

export default CharacterRoutes;
