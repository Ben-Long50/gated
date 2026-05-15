import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Modal from './Modal';
import useModalStore from 'src/stores/modalStore';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { CodexCard } from '../CodexDashboard';
import Divider from '../Divider';

const PictureLibraryModal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);
  const { form } = useOutletContext();

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
      <div className="grid w-full grid-cols-5 gap-4 sm:gap-6">
        {user.generatedPictures.map(
          (picture: { imageUrl: string; publicId: string }, index: number) => (
            <CodexCard
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
      </div>
    </Modal>
  );
};

export default PictureLibraryModal;
