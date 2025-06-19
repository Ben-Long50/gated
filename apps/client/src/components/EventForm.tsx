import { useForm } from '@tanstack/react-form';
import InputField from './InputField';
import { useNavigate, useParams } from 'react-router-dom';
import TextAreaField from './TextAreaField';
import { capitalCase } from 'change-case';
import { mdiArrowULeftBottom, mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import BtnRect from './buttons/BtnRect';
import BtnIcon from './buttons/BtnIcon';
import Modal from './modals/Modal';
import useCreateEventMutation from 'src/hooks/useCreateEventMutation/useCreateEventMutation';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacters from 'src/hooks/useCharacters';

const EventForm = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, month, day } = useParams();
  const navigate = useNavigate();

  const { activeCharacter } = useCharacters();

  const createEvent = useCreateEventMutation(apiUrl, Number(campaignId));

  const eventForm = useForm({
    defaultValues: {
      id: null,
      characterId: activeCharacter?.id,
      name: '',
      description: '',
      month: month,
      day: Number(day),
    },
    onSubmit: ({ value }) => {
      console.log(value);

      createEvent.mutate(value);
    },
  });

  return (
    <Modal>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          eventForm.handleSubmit();
        }}
      >
        <h2 className="w-full text-center">New Event</h2>
        <div className="flex items-center gap-4">
          <h3>{capitalCase(month) || ''}</h3>
          <Icon path={mdiCircle} className="text-secondary" size={0.375} />
          <h3>{day}</h3>
        </div>
        <eventForm.Field
          name="name"
          validators={{
            onSubmit: ({ value }) => {
              if (value.length < 2) {
                return 'Name must be 2 or more characters';
              } else {
                return undefined;
              }
            },
          }}
        >
          {(field) => <InputField label="Event Name" field={field} />}
        </eventForm.Field>
        <eventForm.Field
          name="description"
          validators={{
            onSubmit: ({ value }) => {
              if (value.length < 2) {
                return 'Description must be 2 or more characters';
              } else {
                return undefined;
              }
            },
          }}
        >
          {(field) => <TextAreaField label="Event Description" field={field} />}
        </eventForm.Field>
        <div className="flex w-full items-center gap-8">
          <BtnIcon
            active={true}
            path={mdiArrowULeftBottom}
            onClick={() => navigate(-1)}
          />
          <BtnRect className="grow" type="submit" ariaLabel="Submit event">
            Submit
          </BtnRect>
        </div>
      </form>
    </Modal>
  );
};

export default EventForm;
