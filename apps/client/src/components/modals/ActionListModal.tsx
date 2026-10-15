import { useOutletContext } from 'react-router-dom';
import LinkedActionCard from '../LinkedActionCard';
import { Action } from 'src/types/action';
import { capitalCase } from 'change-case';

const ActionListModal = () => {
  const { actions, category, form, handleChosenItem } =
    useOutletContext() || {};

  return (
    <>
      <h1>{`Available ${capitalCase(category)}s`}</h1>
      <form.Field name="action">
        {(field) =>
          actions.map((action: Action) => (
            <LinkedActionCard
              className="w-full"
              action={action}
              cardWidth={500}
              onClick={() => {
                field.handleChange(action);
                handleChosenItem(action);
              }}
            />
          ))
        }
      </form.Field>
    </>
  );
};

export default ActionListModal;
