import { useOutletContext } from 'react-router-dom';
import Modal from './Modal';
import InputField from '../InputField';
import InputSelectField from '../InputSelectField';
import TextAreaField from '../TextAreaField';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';

const MapSaveModal = () => {
  const { form, isPending } = useOutletContext() || {};

  return (
    <Modal>
      <div className="flex w-full flex-col gap-8">
        <h1 className="text-center">Map Information</h1>
        <form.Field name="type">
          {(field) => (
            <InputSelectField
              field={field}
              label="Map Type"
              options={['location', 'component']}
            />
          )}
        </form.Field>
        <form.Field name="name">
          {(field) => <InputField field={field} label="Name" />}
        </form.Field>
        <form.Field name="description">
          {(field) => <TextAreaField field={field} label="Description" />}
        </form.Field>
        <form.Field name="draft">
          {(field) => (
            <label
              htmlFor="draft"
              className="text-secondary flex items-center justify-between border-x-2 border-gray-400 border-opacity-50 px-4"
            >
              <h4>Draft</h4>
              <input
                className="size-6"
                id="draft"
                name="draft"
                type="checkbox"
                checked={field.state.value}
                onChange={() => {
                  field.handleChange((prev: boolean) => !prev);
                }}
              />
            </label>
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
