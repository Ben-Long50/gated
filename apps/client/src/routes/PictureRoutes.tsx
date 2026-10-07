import { Route } from 'react-router-dom';
import Modal from 'src/components/modals/Modal';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import PromptModal from 'src/components/modals/PromptModal';

const PictureRoutes = () => {
  return (
    <Route path="modal" element={<Modal />}>
      <Route path="library" element={<PictureLibraryModal />} />
      <Route path="prompt" element={<PromptModal />} />
    </Route>
  );
};

export default PictureRoutes;
