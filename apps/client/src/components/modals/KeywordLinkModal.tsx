import Modal from './Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Keywords from '../Keywords';
import BtnRect from '../buttons/BtnRect';
import useModalStore from 'src/stores/modalStore';

const KeywordLinkModal = () => {
  const { field } = useOutletContext() || {};
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);

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
      <Keywords field={field} />
    </Modal>
  );
};

export default KeywordLinkModal;
