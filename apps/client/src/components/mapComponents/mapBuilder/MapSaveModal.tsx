import { useOutletContext } from 'react-router-dom';
import Modal from '../../modals/Modal';
import InputField from '../../formFields/InputField';
import InputSelectField from '../../formFields/InputSelectField';
import TextAreaField from '../../formFields/TextAreaField';
import BtnRect from '../../buttons/BtnRect';
import Loading from '../../Loading';
import InputFieldCheckbox from 'src/components/formFields/InputFieldCheckbox';

const MapSaveModal = () => {
  const { form, isPending } = useOutletContext() || {};

  return (
    <Modal>
      <div className="flex w-full flex-col gap-8">
        <h1 className="text-center">Map Information</h1>
        <form.Field name="type">
          {(field) => (
            <InputSelectField
              label="Map Type"
              options={['map', 'component']}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
        <form.Field name="name">
          {(field) => (
            <InputField
              label="Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextAreaField
              label="Description"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
        <form.Field name="draft">
          {(field) => (
            <InputFieldCheckbox
              label="Draft"
              value={field.state.value}
              checked={field.state.value}
              onChange={() => {
                field.handleChange((prev: boolean) => !prev);
              }}
            />
          )}
        </form.Field>
        <BtnRect
          className="group"
          type="submit"
          ariaLabel="save"
          onClick={() => form.handleSubmit()}
        >
          {isPending ? (
            <Loading
              className="group-hover:text-accent dark:text-gray-900"
              size={1.15}
            />
          ) : (
            'Save Map'
          )}
        </BtnRect>
      </div>
    </Modal>
  );
};

export default MapSaveModal;
