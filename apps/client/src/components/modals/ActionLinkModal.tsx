import Modal from './Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import BtnRect from '../buttons/BtnRect';
import Actions from '../Actions';

const ActionLinkModal = () => {
  const navigate = useNavigate();

  const { field } = useOutletContext() || {};

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const toggleFormLink = (actionId: number) => {
    if (!field.state.value.some((id: number) => id === actionId)) {
      field.handleChange([...field.state.value, actionId]);
    } else {
      field.handleChange(
        field.state.value.filter((id: number) => id !== actionId),
      );
    }
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
      <Actions
        title="Link Actions"
        field={field}
        toggleFormLink={toggleFormLink}
      />
    </Modal>
  );
};

export default ActionLinkModal;
