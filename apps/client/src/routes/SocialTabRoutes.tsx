import { Route } from 'react-router-dom';
import SocialCharacters from 'src/components/SocialCharacters';

const SocialTabRoutes = () => {
  return (
    <Route path="social">
      <Route path="characters" element={<SocialCharacters />} />
    </Route>
  );
};

export default SocialTabRoutes;
