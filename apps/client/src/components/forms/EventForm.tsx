import InputField from '../InputField';
import { useParams } from 'react-router-dom';
import TextAreaField from '../TextAreaField';
import { capitalCase } from 'change-case';
import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import Modal from '../modals/Modal';
import useCreateEventMutation from 'src/hooks/useCreateEventMutation/useCreateEventMutation';
import { useState } from 'react';
import TimeField from '../formFields/TimeField';
import useEventForm from 'src/hooks/form hooks/useEventForm';
import FormLayout from 'src/layouts/FormLayout';

const EventForm = () => {
  const { campaignId, month, day } = useParams();
  const [timeType, setTimeType] = useState<'allDay' | 'setTime'>('allDay');

  const createEvent = useCreateEventMutation(Number(campaignId));

  const eventForm = useEventForm(createEvent);

  return (
    <Modal>
      <FormLayout label="Event" form={eventForm} createMutation={createEvent}>
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
          {(field) => (
            <InputField
              label="Event Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
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
          {(field) => (
            <TextAreaField
              label="Event Description"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
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
      </FormLayout>
    </Modal>
  );
};

export default EventForm;
