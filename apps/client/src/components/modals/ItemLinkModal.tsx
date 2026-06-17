import Modal from './Modal';
import Items from '../Items';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import BtnRect from '../buttons/BtnRect';

const ItemLinkModal = () => {
  const navigate = useNavigate();

  const { form } = useOutletContext() || {};

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return (
    <Modal
      button={
        <BtnRect
          type="button"
          ariaLabel="Confirm preferences"
          className="w-full"
          onClick={() => {
            if (!backgroundPath) {
              navigate('..', { replace: true });
            } else {
              navigate(backgroundPath, { replace: true });
              navigate(-1);
            }
          }}
        >
          Close
        </BtnRect>
      }
    >
      <Items form={form} />
    </Modal>
  );
};

export default ItemLinkModal;
