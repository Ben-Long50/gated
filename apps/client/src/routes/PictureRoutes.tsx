import { Route } from 'react-router-dom';
import PictureLibraryModal from 'src/components/modals/PictureLibraryModal';
import PromptModal from 'src/components/modals/PromptModal';

const PictureRoutes = () => {
  return (
    <>
      <Route path="library" element={<PictureLibraryModal />} />
      <Route path="prompt" element={<PromptModal />} />
    </>
  );
};

export default PictureRoutes;
