import { useOutletContext } from 'react-router-dom';
import Modal from './Modal';
import FormLayout from 'src/layouts/FormLayout';
import ArrowHeader3 from '../ArrowHeader3';
import InputFieldRadio from '../formFields/InputFieldRadio';
import { capitalCase } from 'change-case';
import Divider from '../Divider';
import TextAreaField from '../formFields/TextAreaField';

const ItemPromptModal = () => {
  const { promptForm, generatePicture } = useOutletContext();

  return (
    <Modal>
      <div className="flex w-full flex-col items-center gap-8">
        <h1>Prompt Info</h1>
        <FormLayout
          label="Item Picture"
          form={promptForm}
          createMutation={generatePicture}
        >
          <div className="flex w-full flex-col gap-4">
            <ArrowHeader3 title="Setting" />
            <promptForm.Field name="time">
              {(field) => (
                <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                  {['daytime', 'nighttime', 'sunrise', 'sunset'].map((time) => (
                    <InputFieldRadio
                      label={capitalCase(time)}
                      checked={field.state.value === time}
                      value={time}
                      onChange={(value) => field.handleChange(value)}
                    />
                  ))}
                </div>
              )}
            </promptForm.Field>
            <promptForm.Field name="setting">
              {(field) => (
                <TextAreaField
                  label="Setting Description"
                  value={field.state.value}
                  placeholder="e.g. the interior of a weapons factory with heavy machinery"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <Divider />
            <promptForm.Field name="itemDescription">
              {(field) => (
                <TextAreaField
                  label="Item Description"
                  value={field.state.value}
                  placeholder="e.g. a futuristic assault rifle with 3 long barrels and a red dot sight attachment"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <promptForm.Field name="itemArrangement">
              {(field) => (
                <TextAreaField
                  label="Arrangement Description"
                  value={field.state.value}
                  placeholder="e.g. placed on a table in the factory with weapon schematics laying on the table around it"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
          </div>
        </FormLayout>
      </div>
    </Modal>
  );
};

export default ItemPromptModal;
