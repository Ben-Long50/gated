import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Modal from './Modal';
import useModalStore from 'src/stores/modalStore';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Divider from '../Divider';
import { PictureCard } from '../PictureCard';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import { LayoutContext } from 'src/contexts/LayoutContext';
import InventoryGrid from '../InventoryGrid';

const PictureLibraryModal = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type');

  const backgroundPath = useModalStore((state) => state.backgroundPath);
  const { form } = useOutletContext();

  const pictures = user.generatedPictures.filter(
    (picture) => picture.type === type,
  );

  return (
    <Modal
      button={
        <BtnRect
          ariaLabel="Close"
          onClick={() => {
            if (backgroundPath) {
              navigate(backgroundPath, { replace: true });
            }
          }}
        >
          Close
        </BtnRect>
      }
    >
      <h1>Library</h1>
      <Divider />
      <NavTabs className="grid-cols-2">
        <BtnAuth
          active={type === 'character'}
          onClick={() => setSearchParams({ type: 'character' })}
        >
          Characters
        </BtnAuth>
        <BtnAuth
          active={type === 'item'}
          onClick={() => setSearchParams({ type: 'item' })}
        >
          Items
        </BtnAuth>
      </NavTabs>
      <InventoryGrid minWidth={175}>
        {pictures.map(
          (picture: { imageUrl: string; publicId: string }, index: number) => (
            <PictureCard
              key={index}
              publicId={picture.publicId}
              onClick={() => {
                const currentPicture = form.getFieldValue('picture');
                form.setFieldValue('picture', {
                  ...currentPicture,
                  imageUrl: picture.imageUrl,
                  publicId: picture.publicId,
                });
                if (backgroundPath) {
                  navigate(backgroundPath, { replace: true });
                }
              }}
            />
          ),
        )}
      </InventoryGrid>
    </Modal>
  );
};

export default PictureLibraryModal;
