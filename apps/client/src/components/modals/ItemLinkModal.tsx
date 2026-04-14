import Modal from './Modal';
import Items from '../Items';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import BtnRect from '../buttons/BtnRect';

const ItemLinkModal = () => {
  const navigate = useNavigate();

  const { field } = useOutletContext() || {};

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const toggleFormLink = (itemId: number) => {
    field.handleChange([...field.state.value, itemId]);
  };

  return (
    <Modal
      button={
        <BtnRect
          type="button"
          ariaLabel="Confirm preferences"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
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
      <Items toggleFormLink={toggleFormLink} field={field} />
    </Modal>
  );
};

export default ItemLinkModal;
