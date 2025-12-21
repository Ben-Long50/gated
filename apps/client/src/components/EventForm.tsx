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
import { useContext, useRef, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacters from 'src/hooks/useCharacters';
import TimeField from './formFields/TimeField';
import useCharactersQuery from 'src/hooks/useCharactersQuery/useCharactersQuery';

const EventForm = () => {
  const { campaignId, month, day } = useParams();
  const [timeType, setTimeType] = useState<'allDay' | 'setTime'>('allDay');
  const navigate = useNavigate();

  const createEvent = useCreateEventMutation(Number(campaignId));

  const eventForm = useForm({
    defaultValues: {
      id: null,
      characterId: activeCharacter?.id,
      name: '',
      description: '',
      month: month,
      day: Number(day),
      time: { hour: 0, minute: 0, second: 0 },
    },
    onSubmit: ({ value }) => {
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
        <div className="grid grid-rows-[auto_auto] gap-4 sm:grid-cols-2 sm:gap-8">
          <div className="flex flex-col items-center justify-between gap-3">
            <h3 className="w-full text-left">Event Time</h3>
            <hr className="w-full border border-gray-400 border-opacity-50" />
            <div className="flex w-full items-center justify-between gap-4">
              <label htmlFor="allDay">
                <p>All Day</p>
              </label>
              <input
                id="allDay"
                name="time"
                type="radio"
                className="size-6"
                checked={timeType === 'allDay'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTimeType('allDay');
                    eventForm.setFieldValue('time', {
                      hour: 0,
                      minute: 0,
                      second: 0,
                    });
                  }
                }}
              />
            </div>
            <div className="flex w-full items-center justify-between gap-4">
              <label htmlFor="setTime">
                <p>Set Time</p>
              </label>
              <input
                id="setTime"
                name="time"
                type="radio"
                className="size-6"
                checked={timeType === 'setTime'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTimeType('setTime');
                  }
                }}
              />
            </div>
          </div>
          <div
            className={`${timeType === 'allDay' && 'pointer-events-none opacity-50'}`}
          >
            <TimeField
              className="justify-self-center sm:justify-self-end"
              form={eventForm}
            />
          </div>
        </div>
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
