import { useNavigate, useOutletContext } from 'react-router-dom';
import Modal from './Modal';
import LinkedActionCard from '../LinkedActionCard';
import { Action } from 'src/types/action';
import { capitalCase } from 'change-case';
import BtnRect from '../buttons/BtnRect';

const ActionListModal = () => {
  const { actions, category, form } = useOutletContext() || {};
  const navigate = useNavigate();

  return (
    <Modal>
      <h1>{`Available ${capitalCase(category)}s`}</h1>
      <form.Field name="action">
        {(field) =>
          actions.map((action: Action) => (
            <LinkedActionCard
              className="w-full"
              action={action}
              cardWidth={500}
              onClick={() => field.handleChange(action)}
            />
          ))
        }
      </form.Field>
      <div className="bg-primary sticky bottom-0 w-full">
        <BtnRect ariaLabel="Close" type="button" onClick={() => navigate(-1)}>
          Close
        </BtnRect>
      </div>
    </Modal>
  );
};

export default ActionListModal;
